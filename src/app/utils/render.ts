interface RemoteMainInterface {
    // Taken from `RemoteMainInterface`
    app: Electron.App;
    autoUpdater: Electron.AutoUpdater;
    BrowserView: typeof Electron.BrowserView;
    BrowserWindow: typeof Electron.BrowserWindow;
    ClientRequest: typeof Electron.ClientRequest;
    clipboard: Electron.Clipboard;
    CommandLine: typeof Electron.CommandLine;
    contentTracing: Electron.ContentTracing;
    Cookies: typeof Electron.Cookies;
    crashReporter: Electron.CrashReporter;
    Debugger: typeof Electron.Debugger;
    desktopCapturer: Electron.DesktopCapturer;
    dialog: Electron.Dialog;
    Dock: typeof Electron.Dock;
    DownloadItem: typeof Electron.DownloadItem;
    globalShortcut: Electron.GlobalShortcut;
    inAppPurchase: Electron.InAppPurchase;
    IncomingMessage: typeof Electron.IncomingMessage;
    ipcMain: Electron.IpcMain;
    Menu: typeof Electron.Menu;
    MenuItem: typeof Electron.MenuItem;
    MessageChannelMain: typeof Electron.MessageChannelMain;
    MessagePortMain: typeof Electron.MessagePortMain;
    nativeImage: typeof Electron.NativeImage;
    nativeTheme: Electron.NativeTheme;
    net: Electron.Net;
    netLog: Electron.NetLog;
    Notification: typeof Electron.Notification;
    powerMonitor: Electron.PowerMonitor;
    powerSaveBlocker: Electron.PowerSaveBlocker;
    protocol: Electron.Protocol;
    screen: Electron.Screen;
    ServiceWorkers: typeof Electron.ServiceWorkers;
    session: typeof Electron.Session;
    shell: Electron.Shell;
    systemPreferences: Electron.SystemPreferences;
    TouchBar: typeof Electron.TouchBar;
    TouchBarButton: typeof Electron.TouchBarButton;
    TouchBarColorPicker: typeof Electron.TouchBarColorPicker;
    TouchBarGroup: typeof Electron.TouchBarGroup;
    TouchBarLabel: typeof Electron.TouchBarLabel;
    TouchBarOtherItemsProxy: typeof Electron.TouchBarOtherItemsProxy;
    TouchBarPopover: typeof Electron.TouchBarPopover;
    TouchBarScrubber: typeof Electron.TouchBarScrubber;
    TouchBarSegmentedControl: typeof Electron.TouchBarSegmentedControl;
    TouchBarSlider: typeof Electron.TouchBarSlider;
    TouchBarSpacer: typeof Electron.TouchBarSpacer;
    Tray: typeof Electron.Tray;
    webContents: typeof Electron.WebContents;
    WebRequest: typeof Electron.WebRequest;

    // Taken from `Remote`
    getCurrentWebContents(): Electron.WebContents
    getCurrentWindow(): Electron.BrowserWindow;
    getGlobal(name: string): any;
    process: NodeJS.Process;
    require: NodeJS.Require;
}
const electron = require('electron')
export const remote: RemoteMainInterface = require('@electron/remote')

export const ipcRenderer: Electron.IpcRenderer = electron.ipcRenderer;

export default remote