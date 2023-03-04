// @ts-nocheck
import { StatusModel, TodoModel } from '@/common/interface';
import remote, { ipcRenderer } from './render'
import { getImg, openSetting, quit } from './send';
const { Menu } = remote;

type MenuFunctionType = (id: MenuCallbackType, todo?: TodoModel) => void;
export enum MenuCallbackType {
    编辑,
    完成,
    删除,
    复制,
    撤销完成,
    退出程序,
}

// Todo-Item菜单
export const getTodoItemMenu = (click: MenuFunctionType, todo: TodoModel) => {
    let status: StatusModel = todo.status;
    let todoItemMenu: Array<Electron.MenuItem> = [
        status != StatusModel.finished && !todo.lastCompleteDate ? {
            label: "编辑",
            click: () => click(MenuCallbackType.编辑, todo),
            icon: getImg('static/image/menu/edit.png')
        } : null,
        status != StatusModel.finished && !todo.lastCompleteDate ? {
            label: "完成",
            click: () => click(MenuCallbackType.完成, todo),
        } : {
            label: "撤销完成",
            click: () => click(MenuCallbackType.撤销完成, todo),
        },
        { type: 'separator' },
        {
            label: "删除",
            click: () => click(MenuCallbackType.删除, todo),
            icon: getImg('static/image/menu/copy.png')
        },
        {
            label: "复制",
            click: () => click(MenuCallbackType.复制, todo),
            icon: getImg('static/image/menu/del.png')
        },
    ];
    // 这里需要增加判断代码,数组第一项是null;
    todoItemMenu = todoItemMenu.filter(item => item != null);
    console.log('todoItemMenu', todoItemMenu);
    let todoItemMenuIns = Menu.buildFromTemplate(todoItemMenu);
    todoItemMenuIns.popup();
}


// 获取设置Menu
export const getTopNavMenu = (click: MenuFunctionType) => {
    let menus: Array<Electron.MenuItem> = [
        {
            label: "设置",
            click: () => openSetting(),
            icon: getImg('static/image/menu/setting.png')
        },
        { type: 'separator' },
        {
            label: "退出程序",
            click: () => quit(),
            icon: getImg('static/image/menu/quit.png')
        }
    ];
    // todoItemMenu = todoItemMenu.filter(item => item != null);
    let menusIns = Menu.buildFromTemplate(menus);
    menusIns.popup();
}
