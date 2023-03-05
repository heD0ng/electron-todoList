import { CreateWindowOption } from '@/common/interface';
import { UserSetting } from '@/common/setting';
import { solveWindowShake } from '@/common/utils/window';
import { BrowserWindow } from 'electron';
import { addWindow } from '../manager/windows';
import injectRemote from './injectRemote';
import fs from 'fs-extra';
import path from 'path';

// 创建窗口
export const createWindow = (option: CreateWindowOption): BrowserWindow => {
    const setting = new UserSetting();
    option = Object.assign({
        width: 320,
        height: 700,
        maxWidth: 320,
        minHeight: 500,
        minimizable: false,
        maximizable: false,
        transparent: true,
        frame: false,
        show: true,
        useContentSize: true,
        alwaysOnTop: setting.base.alwaystop,
        webPreferences: {
            // 这两个都需要 不然就报错  开启node
            contextIsolation: false,
            nodeIntegration: true,
            // 跨域
            webSecurity: false,
        }
    }, option)
    const window = new BrowserWindow({ ...option });
    window.loadURL(option.url);
    if (option.show) {
        window.show();
    }
    // 注入远程模块
    injectRemote(window)
    // 添加窗口
    addWindow(window);
    // 解决拖拽抖动问题
    solveWindowShake(window);
    return window;
}

/**
 * 判断是否是第一次运行
 */
export const checkIsFirstRun = (): boolean => {
    let p = path.resolve(process.cwd(), 'resources/run')
    if (!fs.pathExistsSync(p)) {
        fs.mkdirSync(p, { recursive: true })
        return true;
    }
    return false;
}

