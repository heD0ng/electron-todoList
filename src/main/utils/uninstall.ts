import Winreg from "winreg";

// open registry hive HKEY_CURRENT_USER
const regPaths = [
    {
        hive: Winreg.HKCU,
        key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\",
    },
    {
        hive: Winreg.HKLM,
        key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\",
    },
    {
        hive: Winreg.HKLM,
        key: "\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    },
    // {
    //     hive: Winreg.HKCU,
    //     key:  '\\Software\\WOW3432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
    // }
];

const getRegApps = async (hive: string, key: string) => {
    const regKeys = new Winreg({
        hive,
        key,
    });

    return new Promise((resolve) => {
        regKeys.keys((err, items) => {
            console.log(err, items);
            if (err) {
                resolve([]);
            } else {
                resolve(items);
            }
        });
    });
};

export const getRegAppInfoByField = async (data: Winreg.Registry, key: string) => {
    return new Promise((resolve) => {
        data.get(key, (err, item) => {
            if (err) {
                resolve(null);
            }
            const tmp = item ? item.value : "";
            resolve(tmp);
        });
    });
};

export const checkAppInstalled = async (targetName: string, targetVersion: string) => {
    for (let i = 0; i < regPaths.length; i++) {
        const item = regPaths[i];
        try {
            const regAppsList = (await getRegApps(item.hive, item.key)) as any;
            console.log(regAppsList);
            if (regAppsList && regAppsList.length > 0) {
                for (let j = 0; j < regAppsList.length; j++) {
                    const app = regAppsList[j];
                    const appRegInfo = new Winreg({
                        hive: item.hive,
                        key: app.key,
                    });
                    console.log(appRegInfo);
                    if (appRegInfo) {
                        const name = await getRegAppInfoByField(
                            appRegInfo,
                            "DisplayName"
                        ) as string;
                        const version = await getRegAppInfoByField(
                            appRegInfo,
                            "DisplayVersion"
                        );
                        const installLocation = await getRegAppInfoByField(
                            appRegInfo,
                            "InstallLocation"
                        );
                        const uninstallString = await getRegAppInfoByField(
                            appRegInfo,
                            "UninstallString"
                        );
                        if(name.toLowerCase().includes(targetName) && version === targetName) {
                            return {
                                name,
                                version,
                                uninstallString,
                                installLocation
                            }
                        }
                        // console.log(name);
                    }
                }
            }
            return false;
        } catch (error) {
            // console.error(error);
            return false;
        }
    }
};
