<template>
    <div class="home" :class="{
        hidden: hidden
    }">
        <NMessageProvider>
            <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
                <TopNav v-model:lock="lock" />
                <Content />
            </NConfigProvider>
        </NMessageProvider>
    </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import TopNav from "@app/components/TopNav";
import Content from "@app/components/Content";
import { ref, watch } from "vue";
import { leaveToZero, moveToZero } from "@/app/utils/event";
import remote from "@/app/utils/render";
const win = remote.getCurrentWindow();
win.setIgnoreMouseEvents(false);
// 锁定
const lock = ref(false);
watch(lock, (newV) => {
    if (newV) {
        hidden.value = false;
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null;
        }
    } else {
        if (win.getPosition()[1] <= 0) {
            initInfo();
        }
    }
})

// 隐藏
const hidden = ref(false)
let intervalId;
const checkShowOrHidden = () => {
    // 当前鼠标所在位置
    const cursorPos = remote.screen.getCursorScreenPoint();
    if (hidden.value) {
        // 进入可视区，展示
        if (cursorPos.x >= posXMin && cursorPos.x <= posXMax && cursorPos.y <= posYMaxHidden) {
            hidden.value = false;
            remote.getCurrentWindow().setIgnoreMouseEvents(false)
        }
    } else {
        // 展示时，移出窗口范围，重新恢复隐藏
        if (cursorPos.x < posXMin || cursorPos.x > posXMax || cursorPos.y > posYMax) {
            hidden.value = true;
            win.setIgnoreMouseEvents(true, { forward: true })
        }
    }
}

let posXMin = 0;
let posXMax = 0;
let posYMax = 0;
let posYMaxHidden = 5;
const initInfo = () => {
    // 窗口高度和宽度
    let size = win.getSize();
    // 当前窗口位于桌面的左上角坐标
    const winPos = win.getPosition();
    posXMin = winPos[0];
    posXMax = posXMin + size[0];
    posYMax = size[1];
    win.setResizable(false)
    if (!intervalId)
        intervalId = setInterval(checkShowOrHidden, 300);
}
// 贴边时才不断初始化信息
moveToZero(initInfo)
leaveToZero(() => {
    win.setResizable(true);
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
})

</script>

<style lang="less" scoped>
.hidden {
    transform: translateY(-100%);
}
.home {
    position: relative;
    width: 100%;
    height: 100%;
    background: fade(#414141, 50%);
    transition: all 0.3s ease-out;
}
.show {
    height: 9px;
    width: 100%;
    position: absolute;
    bottom: -9px;
    left: 0;
    background: white;
}
</style>
