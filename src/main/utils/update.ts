import { dialog, app } from "electron";
import { autoUpdater } from 'electron-updater';

export function checkUpdate() {
    if(process.platform === 'darwin') return;
    // latest.yml的URL地址
    autoUpdater.setFeedURL('http://127.0.0.1:9001/');
    // 自动下载
    autoUpdater.autoDownload = false;

    autoUpdater.on('error', (err) => {
        console.error(err);
    })
    
    // 检查新版本
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '下载更新',
            message: '发现新版本，是否下载更新？',
            buttons: ['是', '否']
        }).then((i) => {
            if (i.response == 0) {
                autoUpdater.downloadUpdate();
            }
        })
    })
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '安装更新',
            message: '更新下载完成，是否安装？',
            buttons: ['是', '否']
        }).then((i) => {
            if (i.response == 0) {  //选择是，则退出程序，安装新版本
                autoUpdater.quitAndInstall();
                app.quit();
            }
        })
    })

    // 检查更新
    autoUpdater.checkForUpdates();
}