import { BrowserWindow, net, Notification, dialog } from "electron";

let timer;
export const checkNetworkStatus = (win: BrowserWindow) => {
    win.webContents.on('did-fail-load', () => {
        dialog.showErrorBox('网络错误', '客户端网络离线')
    });
    win.webContents.on('did-finish-load', () => {
        console.log('online');
    });
    checkNetworkTimer();
};

function checkNetworkTimer() {
    timer = setInterval(() => {
        const res = net.isOnline();
        if (!res) {
            dialog.showErrorBox('网络错误', '客户端网络离线')
            clearInterval(timer);
        }
    }, 5000)
};