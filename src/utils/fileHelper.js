const fs = window.require('fs').promises //node提供的处理本地文件的方法
const { unlink } = window.require('fs')
const path = window.require('path')//处理文件路劲相关方法

//新建文件处理对象
const  fileHelper = {
    //读取文件
    readFile: (path) => {
        return fs.readFile(path, { encoding: 'utf8' })
    },
    //写入文件
    writeFile: (path, content) => {
        return fs.writeFile(path, content, { encoding: 'utf8' })
    },
    //重命名文件
    renameFile: (path, newPath) => {
        return fs.rename(path, newPath)
    },
    //删除文件
    deleteFile: (path) => {
        return fs.unlink(path)
    }
}

export default fileHelper
