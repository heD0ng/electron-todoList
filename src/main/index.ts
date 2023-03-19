import { app, BrowserWindow,globalShortcut,HandlerDetails, Menu, nativeImage, shell, Tray } from 'electron';
import { baseUrl } from './config';
import '@/common/load';
import { bridgeKey } from '@/common/bridge';
import { checkIsFirstRun, createWindow } from './utils/window';
import { getImagePath } from './manager/file';
import { StatusModel } from '@/common/interface';
import { addTodo } from './manager/todo';
import './event';
import { addCrashReport } from './utils/crash';
import {checkUpdate} from './utils/update';
import { checkNetworkStatus } from './utils/net';

const gotTheLock = app.requestSingleInstanceLock();
// 主窗口
let mainWindow: BrowserWindow;
// 系统托盘
let tray: Tray;

// 创建主窗口
const initMain = () => {
    mainWindow = createWindow({
        url: baseUrl,
        dev: true,
        show: true,
        skipTaskbar: true,
    })

    // 监听窗口移动事件
    mainWindow.addListener('moved', (e: Electron.Event) => {
        const pos = mainWindow.getPosition();
        if (pos[1] <= 2) {
            mainWindow.setPosition(pos[0], 0);
            mainWindow.webContents.send(bridgeKey.moveToZero);
        } else {
            mainWindow.webContents.send(bridgeKey.leaveToZero);
        }
    })
    mainWindow.addListener('will-move', () => {
        mainWindow.webContents.send(bridgeKey.leaveToZero);
    })

    // 用默认浏览器打开URL;
    mainWindow.webContents.setWindowOpenHandler((details: HandlerDetails) => {
        shell.openExternal(details.url);
        return {action: 'deny'}
    })
    // 用于测试环境调试
    globalShortcut.register('CommandOrControl+Shift+L', () => {
        let focusWin = BrowserWindow.getFocusedWindow();
        focusWin && focusWin.webContents.openDevTools();
    })
}

// 托盘
const initTray = () => {
    tray = new Tray(nativeImage.createFromPath(getImagePath('static/image/menu/logo.png')))
    let menu = [{
        label: "退出登录",
        click: () => app.quit(),
        icon: getImagePath('static/image/menu/quit.png')
    }]
    tray.setContextMenu(Menu.buildFromTemplate(menu));

    tray.addListener('double-click', () => {
        mainWindow.show();
    })
}

// 初始化数据
const firstRunInit = () => {
    addTodo({
        content: '点击“新增待办”增加一条TODO',
        status: StatusModel.noFinish
    })
}

if (!gotTheLock) {
    app.quit();
} else {
    checkNetworkStatus();
    addCrashReport();
    checkUpdate();
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 打开之前的
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore()
            }
            mainWindow.focus()
        }
    })

    app.whenReady().then(() => {
        // 判断首次运行
        if (checkIsFirstRun()) {
            firstRunInit();
        }
        // 创建主窗口
        initMain();
        // 区分开发与生产环境
        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools({ mode: "detach" });
        }
        // 创建托盘
        initTray();
    })
}
// 多窗口
// app.whenReady().then(() => {
//     addCrashReport();
//     // 判断首次运行
//     if (checkIsFirstRun()) {
//         firstRunInit();
//     }
//     // 创建主窗口
//     initMain();
//     // 区分开发与生产环境
//     if (!app.isPackaged) {
//         mainWindow.webContents.openDevTools({ mode: "detach" });
//     }
//     // 创建托盘
//     initTray();
// })