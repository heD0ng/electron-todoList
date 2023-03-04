<template>
    <div
        class="todo-item"
        :class="{
            'not-edit': !isEdit,
            'over-due': todo.status == StatusModel.timeout,
        }"
        @click.right="showMenu"
    >
        <div class="show-item" v-if="!isEdit">
            <n-checkbox
                v-if="check"
                :checked="
                    todo.status == StatusModel.finished
                "
                :on-update:checked="completeClick"
            />
            <n-popover
                to="#popover"
                trigger="hover"
                raw
                :show-arrow="false"
                width="trigger"
            >
                <template #trigger>
                    <div
                        @dblclick.left="dbClickItem"
                        class="text"
                        :class="{
                            'check-text':
                                todo.status == StatusModel.finished
                        }"
                    >
                        {{ todo?.content }}
                    </div>
                </template>
            </n-popover>
        </div>
        <AddTodoInfo v-else :todo="todo" @close="closeClick" @ok="okClick" />
    </div>
</template>

<script setup lang="ts">
import { NPopover } from "naive-ui";
import { getTodoItemMenu, MenuCallbackType } from "@/app/utils/menu";
import remote from "@/app/utils/render";
import {
    cancelCompleteTodo,
    completeTodo,
    editTodo,
    remTodo,
} from "@/app/utils/send";
import {
    StatusModel,
    TodoModel,
} from "@/common/interface";
import { NCheckbox, useMessage } from "naive-ui";
import { ref } from "vue";
import AddTodoInfo from "../AddTodoInfo";

const message = useMessage();

interface Props {
    todo: TodoModel;
    check?: boolean;
    menu?: (todo: TodoModel) => void;
}
const props = withDefaults(defineProps<Props>(), {
    todo: null,
    check: true,
    menu: null,
});

const emits = defineEmits<{
    (e: "refresh"): void;
}>();

// 编辑
const isEdit = ref(false);
const dbClickItem = (e: MouseEvent) => {
    if (!props.check) return;
    e.stopPropagation();
    isEdit.value = true;
};

// 完成
const completeClick = (check) => {
    console.log(111, check);
    if (check) {
        // 已完成
        completeTodo(props.todo.id);
    } else {
        // 未完成
        cancelCompleteTodo(props.todo.id);
    }
};
// 没修改关闭
const closeClick = () => {
    isEdit.value = false;
};
// 已修改
const okClick = (model: TodoModel) => {
    model.id = props.todo.id;
    const result = editTodo(model);
    closeClick();
};

// 显示菜单
const menuItemClick = (id: MenuCallbackType, todo: TodoModel) => {
    switch (id) {
        case MenuCallbackType.删除:
            let result = remTodo(todo.id);
            if (result.code == 1) {
                message.success("删除成功");
            } else {
                message.error("删除失败");
            }
            break;
        case MenuCallbackType.编辑:
            isEdit.value = true;
            break;
        case MenuCallbackType.完成:
        case MenuCallbackType.撤销完成:
            completeClick(id == MenuCallbackType.完成 ? true : false);
            break;
        case MenuCallbackType.复制:
            remote.clipboard.writeText(todo.content+'-副本');
            message.success("复制成功");
            break;
    }
};
const showMenu = () => {
    if (props.menu) {
        props.menu(props.todo);
        return;
    }
    if (isEdit.value) return;
    getTodoItemMenu(menuItemClick, props.todo);
};
</script>

<style lang="less" scoped>
.todo-popover-info {
    width: 100%;
    height: 100%;
    background: red;
    color: white;
    border: 10px;
}
.active {
    background: rgba(70, 70, 70, 0.8);
}

.not-edit {
    &:hover {
        background: rgba(70, 70, 70, 0.5);
    }
}

.todo-item {
    padding: 5px;

    .show-item {
        display: flex;
        align-items: center;
    }

    .icons {
        display: flex;
        justify-content: center;
        align-items: center;

        [class*="icon-"] {
            font-size: 12px;
            margin-left: 5px;
        }
    }

    :deep(.n-checkbox) {
        --n-color: transparent !important;
        --n-border: 1px solid @base-color !important;
        --n-border-focus: 1px solid @base-color !important;
        --n-box-shadow-focus: 1px solid @base-color !important;
        --n-border-checked: 1px solid @base-color-3 !important;
        --n-color-checked: transparent !important;
        --n-check-mark-color: @base-color-3 !important;
        --n-text-color: @base-color !important;
    }

    .check-text {
        text-decoration: line-through;
        text-decoration-color: red;
        color: @base-color-5;
    }
    .text {
        width: 80%;
        margin-left: 10px;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
    }
}

.over-due {
    :deep(.n-checkbox) {
        --n-border: 1px solid red !important;
    }
    .show-item {
        color: red;
    }
}
</style>
