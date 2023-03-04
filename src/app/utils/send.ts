import { bridgeKey } from "@/common/bridge";
import { CreateWindowOption, ResultInfo, TodoModel } from "@/common/interface";
import { BaseSetting, UserSetting } from "@/common/setting";
import remote, { ipcRenderer } from "./render";

// 退出程序
export const quit = () => {
    return ipcRenderer.sendSync(bridgeKey.quit)
}

// 打开设置面板
export const openSetting = () => {
    const s = remote.screen.getPrimaryDisplay().workAreaSize;
    const seeWidth = s.width * 0.5;
    const seeHeight = s.height * 0.5;
    let option: CreateWindowOption = {
        url: 'setting',
        dev: false,
        show: true,
        skipTaskbar: true,
        x: seeWidth,
        y: seeHeight,
        maxHeight: 0,
        minWidth: 0,
        maxWidth: 0,
        height: seeHeight,
        resizable: false,
    };
    return ipcRenderer.sendSync(bridgeKey.createWindow, option)
}

// 获取用户设置
export const getUserSetting = (): UserSetting => {
    return ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
}


// 修改基础设置
export const changeBaseSetting = (base: BaseSetting) => {
    return ipcRenderer.sendSync(bridgeKey.changeBaseSetting, base);
}

// 新增
export const addTodo = (todo: TodoModel): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.addTodo, todo);
    return data;
}

// 删除
export const remTodo = (id: number): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.delTodo, id);
    return data;
}

// 编辑
export const editTodo = (todo: TodoModel): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.editTodo, todo);
    return data;
}

// 完成
export const completeTodo = (id: number): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.completeTodo, id);
}
// 取消完成
export const cancelCompleteTodo = (id: number): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.cancelCompleteTodo, id);
}

// 获取todoList
export const getTodo = (): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.getTodoList);
    console.log('data', data);
    return data;
}

// 获取图片
export const getImg = (path: string): Electron.NativeImage => {
    const img = ipcRenderer.sendSync(bridgeKey.getImg, path);
    return img;
}
