import path from 'path';
import { app, crashReporter } from 'electron';
const appPath = app.getAppPath();
const crashPath = path.resolve(appPath, 'crashes')
app.setPath('crashDumps', crashPath);

// 该方法应尽早地在app启动后调用，最好在 app.on('ready') 之前。
export const addCrashReport = () => {
    crashReporter.start({
        uploadToServer: false
    })
};
