<template>
    <div
        class="top-nav"
        :class="{
            drag: !lock,
        }"
    >
        <div class="left">
            <div>便签</div>
            <n-badge :dot="count > 0" class="custom-dot">
                <span class="icon-msg" />
            </n-badge>
        </div>
        <div class="right">
            <span
                :class="{ 'icon-unlock': !lock, 'icon-lock': lock }"
                @click="lockClick(!lock)"
            />
            <span class="icon-menu" @click="showMenu" />
            <span class="icon-mini" @click="miniClick" />
        </div>
    </div>
</template>

<script setup lang="ts">
import remote from "../../utils/render";
import { NBadge } from "naive-ui";
import { ref } from "vue";
import { getTopNavMenu, MenuCallbackType } from "@/app/utils/menu";

interface IProps {
    lock?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
    lock: false,
});
const emits = defineEmits<{
    (e: "update:lock", b: boolean): void;
}>();

// 锁定
const count = ref(0);
const lockClick = (e) => {
    emits("update:lock", e);
};

// 最小化
const shrink = ref(false);
const miniClick = () => {
    remote.getCurrentWindow().minimize();
};

// 菜单展示
const menuClick = (id: MenuCallbackType) => {};
const showMenu = () => {
    getTopNavMenu(menuClick);
};
</script>

<style lang="less" scoped>
.drag {
    -webkit-app-region: drag;
}
.top-nav {
    position: absolute;
    top: 0;
    width: 100%;
    height: 40px;
    background: fade(#3b3b3b, 80%);
    display: flex;

    & > div {
        width: 50%;
    }
    .left,
    .right {
        [class*="icon-"] {
            margin: 0 5px;
        }
    }

    .custom-dot {
        :deep(.n-badge-sup) {
            left: 70%;
            bottom: 60%;
        }
    }
    // 左侧标题
    .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 10px;
        & > div {
            user-select: none;
            color: @base-color;
        }
    }
    // 右侧信息
    .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 10px;
    }
}
</style>
