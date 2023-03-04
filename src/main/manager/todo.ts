import { IResultDataInfoArray, ResultInfo, StatusModel, TodoModel } from "@/common/interface";
import { SnowflakeIdv1 } from 'simple-flakeid';
import { DB, getDB } from "../utils/db";
import lodash from 'lodash'
import moment from "moment";
import { timeReverse } from "@/common/utils/time";

let snow = new SnowflakeIdv1({ workerId: 1 });
// 默认库
let db = getDB<TodoModel>('todo');
// finished库
let completeDb = getDB<TodoModel>('completeTodo');

// 过滤TodoModel
export const filterTodoModel = (todo: TodoModel): TodoModel => {
    let keys = Object.keys(todo).filter(m => m.startsWith('_'));
    keys.forEach(key => {
        delete todo[key]
    })
    return todo;
}

/**
 * 新增
 * @param todo 
 */
export const addTodo = (todo: TodoModel): ResultInfo => {
    todo = filterTodoModel(todo);
    let id = snow.NextId();
    while (db.data.find(m => m.id == id)) {
        id = snow.NextId();
    }
    todo.id = id as number;
    const now = moment();
    todo.createTime = now.unix();
    todo.createDate = now.format('YYYY-MM-DD')
    db.insert(todo);
    return ResultInfo.success();
}

/**
 * 删除
 * @param id id
 * @returns 
 */
export const delTodo = (id: number): ResultInfo => {
    let tempDb = db;
    let model = db.data.find(m => m.id == id);
    let index = db.data.findIndex(m => m.id == id);
    // 如果没找到去finished里面找
    if (!model) {
        model = completeDb.data.find(m => m.id == id);
        index = completeDb.data.findIndex(m => m.id == id)
        tempDb = completeDb;
        // 判断删除的时候是最后一次完成的记录
        if (model && model.parentId) {
            let temp = db.data.find(m => m.id == model.parentId);
            if (temp) {
                delete temp.lastCompleteDate;
                db.update();
            }
        }
    }
    if (model) {
        model.status = StatusModel.deleted;
        tempDb.remove(index, 1);
        return ResultInfo.success();
    }
    return ResultInfo.failed("删除失败")
}

/**
 * 编辑
 * @param todo 
 * @returns 
 */
export const editTodo = (todo: TodoModel): ResultInfo => {
    todo = filterTodoModel(todo);
    let index = db.data.findIndex(m => m.id == todo.id);
    if (index > -1) {
        db.change(index, todo, ['id'])
        return ResultInfo.success();
    }
    return ResultInfo.failed('不存在')
}

/**
 * 完成
 * @param id 
 */
export const completeTodo = (id: number): ResultInfo => {
    let model = db.data.find(m => m.id == id);
    let index = db.data.findIndex(m => m.id == id);
    if (model) {
        const now = moment();
        model.status = StatusModel.finished;
        model.completeTime = now.unix();
        model.completeDate = now.format('YYYY-MM-DD')
        db.remove(index, 1);
        completeDb.insert(model);
        return ResultInfo.success();
    }
    return ResultInfo.failed('不存在');
}
/**
 * 撤销完成
 * @param id 
 */
export const cancelCompleteTodo = (id: number): ResultInfo => {
    let model = completeDb.data.find(m => m.id == id);
    let index = completeDb.data.findIndex(m => m.id == id);
    if (model) {
        model.status = StatusModel.noFinish;
        delete model.completeTime;
        delete model.completeDate;
        completeDb.remove(index, 1);
        db.insert(model);
        return ResultInfo.success();
    }
    return ResultInfo.failed('不存在')
}
/**
 * 获取TodoList
 */
export const getTodo = (): ResultInfo => {
    let allData = db.data.concat(completeDb.data);
    let data = lodash.chain(allData)
        .filter(m => !m.parentId)
        .sortBy((o) => o.status)
        .sortBy(o => o.lastCompleteDate ? 1 : 0)
        .value()
    return ResultInfo.success(data);
}

/**
 * 获取Data数据
 * @param db 从那个库获取数据
 * @returns 
 */
export const getDataList = (db: DB<TodoModel>, date: string = "createDate"): Array<IResultDataInfoArray<TodoModel>> => {
    let data = new Map<string, TodoModel[]>();
    let keys = [];
    db.data.forEach(todo => {
        if (data.has(todo[date])) {
            data.get(todo[date]).push(todo)
        } else {
            data.set(todo[date], [todo])
        }
        if (!keys.includes(todo[date])) {
            keys.push(todo[date])
        }
    })
    keys = keys.sort(timeReverse)
    let result: Array<IResultDataInfoArray<TodoModel>> = [];
    keys.forEach(item => {
        result.push({
            key: item,
            value: data.get(item)
        })
    })
    return result;
}
