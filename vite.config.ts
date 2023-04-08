import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import buildElectron from "@bin-tools/build-electron";
// import buildElectron from './src/plugins/build-electron'

const vueOutDir = "./release/bundle";

export default defineConfig({
    plugins: [
        vue(), 
        buildElectron()
    ],
    base: "./",
    build: {
        outDir: vueOutDir,
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ["vue", "vue-router"],
                    moment: ["moment"],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@app": path.resolve(__dirname, "src/app"),
            "@pages": path.resolve(__dirname, "src/app/pages"),
            "@common": path.resolve(__dirname, "src/common"),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true;@import (reference) "${path.resolve(
                        "src/app/index.less"
                    )}";`,
                },
                javascriptEnabled: true,
            },
        },
    },
    // @ts-ignore 打包electron配置
    electron: {
        // 打包的入口文件
        entry: path.join(process.cwd(), "src/main/index.ts"),
        // 输出的文件路径 使用 vite中的配置 build.outDir
        // 输出的文件名
        outPut: "index.js",
        // electron-builder  参考 https://juejin.cn/post/7140962767275556901 配置
        builderOptions: {
            config: {
                directories: {
                    output: "./release/electron",
                    app: vueOutDir,
                },
                files: ["**"],
                copyright: 'CopyRight @Hd 2023',
                // 打包后的软件名
                productName: "记事本",
                appId: "com.hd.todo.list.app",
                // 加密:混淆代码
                asar: true,
                extraResources: "./resource/electron",
                // win要求256*256的icon/png，建议使用png
                win: {
                    // target: ["zip", "nsis"],
                    // 64位系统默认兼容32位系统，所以只需要打包为32位即可
                    icon: "./public/logo.ico",
                    target: [
                        {
                            target: "zip",
                            arch: [
                                "ia32",
                            ]
                        },
                        {
                            target: "nsis",
                            arch: [
                                "ia32",
                            ]
                        },
                    ]
                },
                // mac要求512*512的icon
                mac: {
                    icon: "./public/logo.ico",
                    category: "public.app-category-productivity",
                    artifactName: "${productName}_${version}.${ext}", // 应用程序包名
                    target: ["dmg", "zip"],
                },
                nsis: {
                    // 是否一键安装，建议为 false，可以让用户点击下一步、下一步、下一步的形式安装程序，如果为true，当用户双击构建好的程序，自动安装程序并打开，即：一键安装（one-click installer）
                    oneClick: false,
                    // 是否开启安装时权限限制（此电脑或当前用户）
                    // perMachine: true,
                    // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
                    allowToChangeInstallationDirectory: true,
                    // 卸载时删除用户数据
                    deleteAppDataOnUninstall: true,
                    // 安装图标
                    // installerIcon: 'build/installerIcon_120.ico',
                    // 卸载图标
                    // uninstallerIcon: 'build/uninstallerIcon_120.ico',
                    // 安装时头部图标
                    // installerHeaderIcon: 'build/installerHeaderIcon_120.ico',
                    // 创建桌面图标
                    createDesktopShortcut: true,
                    // 创建开始菜单图标
                    // createStartMenuShortcut: true
              }
            },
            projectDir: process.cwd(),
        },
        // 静态资源拷贝
        staticDir: [
            {
                // 源文件夹路径
                src: "src/static",
                // 目标文件夹路径
                dest: vueOutDir.substring(2, vueOutDir.length) + "/static",
            },
        ],
    },
});
