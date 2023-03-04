import { app } from 'electron';
import Store from 'electron-store'
import path from 'path'

const store = new Store({
    name: "user-setting"
});

// 基本设置
export interface BaseSetting {
    alwaystop: boolean;
    autostart: boolean;
}
// 用户设置
export class UserSetting {
    _key: string;
    // 基本设置
    base: BaseSetting;
    // 初始化
    constructor(key: string = "user-setting") {
        this._key = key;
        this.init();
    }
    // 初始化第一次
    private init() {
        this.base = {
            alwaystop: true,
            autostart: true
        }

        let data = store.get(this._key) as UserSetting;
        if (data) {
            this.base = Object.assign(this.base, data.base)
        }
        else {
            // 首次初始化
            app.setLoginItemSettings({
                openAtLogin: true,
            })
        }
        this.write();
    }
    write() {
        store.set(this._key, this)
    }
}