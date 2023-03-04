import { BrowserWindowConstructorOptions } from "electron";

export interface IResultDataInfoArray<T> {
    key?: string;
    value?: T[]
}

export class ResultInfo {
    code: number;
    msg: any;
    constructor(code: number, msg?: any) {
        this.code = code;
        this.msg = msg;
    }
    static success(msg?: any): ResultInfo {
        return new ResultInfo(1, msg)
    }
    static failed(msg: any): ResultInfo {
        return new ResultInfo(0, msg)
    }
}

// TODO
export interface TodoModel {
    // 唯一id
    id?: number;
    // 内容
    content: string;
    // 任务状态
    status: StatusModel;
    // 创建时间
    createTime?: number;
    createDate?: string;
    // 完成时间
    completeTime?: number;
    completeDate?: string;
    // 最后的完成时间
    lastCompleteDate?: string;
    // 父级id
    parentId?: number;
    // 扩展信息
    _extend?: TodoExtendModel,
}

// 扩展信息
export interface TodoExtendModel {
    // 已超过多少毫秒
    ms?: number;
    // 临时记入已删除
    remove?: boolean;
}


// todo-item：状态
export enum StatusModel {
    'noFinish' = 'noFinish',
    'timeout' = 'timeout',
    'finished' = 'finished',
    'deleted' = 'deleted'
}

/**
 * 窗口配置信息
 */
export interface CreateWindowOption extends BrowserWindowConstructorOptions {
    // 加载的url
    url: string;
    // 打开dev工具
    dev: boolean;
    // 显示
    show: boolean;
}
