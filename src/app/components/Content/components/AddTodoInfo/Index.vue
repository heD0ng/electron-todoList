<template>
    <div class="add-todo-info">
        <n-input
            ref="input"
            class="info-input"
            type="textarea"
            placeholder="请输入TODO内容"
            :autofocus="true"
            :value="value"
            size="small"
            :maxlength="maxLength"
            :on-input="onInput"
            :autosize="{
                minRows: 1,
                maxRows: 6,
            }"
        />
        <div class="info-extend">
            <div class="one"></div>
            <div class="two">{{ `${currentLength} / ${maxLength}` }}</div>
            <div class="three">
                <span class="icon-close" @click="closeClick" />
                <span class="icon-ok" @click="okClick" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StatusModel, TodoModel } from "@/common/interface";
import { NInput, useMessage } from "naive-ui";
import {  onMounted, ref, Ref, toRaw } from "vue";
import _ from "lodash";

const emits = defineEmits<{
    (e: "close"): void;
    (e: "ok", model: TodoModel): void;
}>();
interface Props {
    todo?: TodoModel;
}

const message = useMessage();
const input: Ref<HTMLInputElement> = ref(null);

// 自动聚焦
onMounted(() => {
    input.value.focus();
});

const maxLength = 200;
const value = ref("");
const currentLength = ref(0);

const props = withDefaults(defineProps<Props>(), {
    todo: null,
});
if (props.todo) {
    value.value = props.todo.content;
    currentLength.value = value.value.length;
}

// 输入事件
const onInput = (e) => {
    value.value = e;
    currentLength.value = e.length;
};
// 关闭事件
const closeClick = () => {
    emits("close");
};
// 确认事件
const okClick = () => {
    if (currentLength.value == 0) {
        message.error("请输入待办内容");
        return;
    }
    emits("ok", {
        content: value.value,
        status: StatusModel.noFinish,
    });
};

</script>

<style lang="less" scoped>
@border: 1px solid @base-color-3;
.add-todo-info {
    width: 100%;
    color: @base-color;
    border: @border;
    border-radius: 5px;

    .info-input {
        background: transparent;

        :deep(.n-input__border) {
            border: none !important;
        }
        :deep(.n-input__state-border) {
            border: none !important;
        }

        // --n-border: 1px solid @base-color-3 !important;
        // --n-border-hover: none !important;
        // --n-border-pressed: none !important;
        // --n-border-focus: none !important;
        --n-box-shadow-focus: none !important;
        --n-text-color: @base-color !important;
        --n-text-color-hover: @base-color !important;
        --n-text-color-pressed: @base-color !important;
        --n-text-color-focus: @base-color !important;
        --n-caret-color: none !important;
        --n-loading-color: none !important;
        --n-placeholder-color: @base-color-3 !important;
    }

    .info-extend {
        width: 100%;
        border-top: @border;
        display: flex;

        .one {
            width: 60%;

            .function {
                margin: 0 10px;
            }
        }
        .two {
            width: 20%;
            text-align: right;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .three {
            width: 20%;
            border-left: @border;
            display: flex;
            justify-content: space-around;
            align-items: center;

            span {
                width: 50%;
                text-align: center;
                height: 100%;

                display: flex;
                justify-content: space-around;
                align-items: center;
            }

            .icon-close {
                font-size: 12px;
            }
            .icon-ok {
                font-size: 15px;
            }
        }

        .icon-time {
            font-size: 12px;
        }
    }

    :deep(.n-input__textarea-el) {
        width: calc(100% - 24px);
    }
}
</style>
