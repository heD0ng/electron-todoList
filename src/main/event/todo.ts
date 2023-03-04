import { bridgeKey } from "@/common/bridge";
import { TodoModel } from "@/common/interface";
import { ipcMain, IpcMainEvent } from "electron";
import { addTodo, cancelCompleteTodo, completeTodo, delTodo, editTodo, getTodo } from "../manager/todo";
import { broadCast } from "../manager/windows";

// 新增todo
ipcMain.addListener(bridgeKey.addTodo, (event: IpcMainEvent, todo: TodoModel) => {
    event.returnValue = addTodo(todo)
    broadCast(bridgeKey.refresh)
});

// 删除todo
ipcMain.addListener(bridgeKey.delTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = delTodo(id);
    broadCast(bridgeKey.refresh)
})

// 编辑
ipcMain.addListener(bridgeKey.editTodo, (event: IpcMainEvent, todo: TodoModel) => {
    event.returnValue = editTodo(todo);
    broadCast(bridgeKey.refresh)
})

// 完成
ipcMain.addListener(bridgeKey.completeTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = completeTodo(id);
    broadCast(bridgeKey.refresh);
})

// 取消完成
ipcMain.addListener(bridgeKey.cancelCompleteTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = cancelCompleteTodo(id);
    broadCast(bridgeKey.refresh)
})

// 获取todo列表
ipcMain.addListener(bridgeKey.getTodoList, (event: IpcMainEvent) => {
    event.returnValue = getTodo();
})

export default null;