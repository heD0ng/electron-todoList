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
    console.log(hive, key);

    return new Promise((resolve) => {
        regKeys.keys((err, items) => {
            if (err) {
                resolve([]);
            } else {
                resolve(items);
            }
        });
    });
};

export const getRegAppInfoByField = async (data: Winreg.Data, key: string) => {
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

export const checkAppInstalled = async (name: string, version: string) => {
    for (let i = 0; i < regPaths.length; i++) {
        const item = regPaths[i];
        try {
            const regAppsList = (await getRegApps(item.hive, item.key)) as any;
            if (regAppsList && regAppsList.length > 0) {
                for (let j = 0; j < regAppsList.length; j++) {
                    const app = regAppsList[j];
                    const appReg = new Winreg({
                        hive: item.hive,
                        key: app.key,
                    });
                    if (appReg) {
                        const name = await getRegAppInfoByField(
                            appReg,
                            "DisplayName"
                        );
                        const version = await getRegAppInfoByField(
                            appReg,
                            "DisplayVersion"
                        );
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
};
