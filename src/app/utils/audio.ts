import { bridgeKey } from "@/common/bridge"
import { UserSetting } from "@/common/setting";
import { refreshSetting } from "./event";
import { ipcRenderer } from "./render"

// 用户设置
let userSetting = ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
refreshSetting(() => {
    userSetting = ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
})


