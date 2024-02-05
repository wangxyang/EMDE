/**
 * 主进程 main process文件 依赖electron 加载window并打开react默认访问地址及端口
 */
const { app, BrowserWindow, Menu} = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/electron/MenuTemplate')

//app准备完成即加载主窗口 
let mainWindow;
app.on('ready', () => {
    //创建窗口 
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        webPreferences: {
            nodeIntegration: true, //主窗口允许使用node方法 包括文件系统和网络访问
        }
    })
    //设置url变量 通过 @electron-is-dev 判断当前开发/生产环境 开发环境加载React默认地址
    const urlLocation = isDev ? 'http://localhost:3000' : 'blank'
    mainWindow.loadURL(urlLocation)
    //设置原生菜单
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})