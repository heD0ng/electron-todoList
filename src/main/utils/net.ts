const { net } = require("electron");

export const checkNetworkStatus = () => {
    const onlineStatus = navigator.onLine;
    if (onlineStatus) {
        console.log("Online");
    } else {
        console.log("Offline");
        new Notification('客户端网络离线');
    }
};

setInterval(() => {
    checkNetworkStatus();
}, 5000);
