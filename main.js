//主进程 main process文件 依赖electron 加载window并打开react默认访问地址及端口
const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')

//主窗口变量
let mainWindow;
app.on('ready', () => {
    //创建窗口 
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true, //主窗口允许使用node方法
        }
    })
    //设置url变量 通过 @electron-is-dev 判断当前开发/生产环境
    const urlLocation = isDev ? 'http://localhost:3000' : 'blank'
    mainWindow.loadURL(urlLocation)
})