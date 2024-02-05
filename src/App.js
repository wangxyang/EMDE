import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'

import { faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons'

import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import SimpleMDE from "react-simplemde-editor"
import TabList from './components/TabList';
import fileHelper from './utils/fileHelper';
import { flattenArr, objToArr } from './utils/helper'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

const { join, basename, extname, dirname } = window.require('path') //文件路径
const { remote } = window.require('electron')//remote是electron提供的renderer.js可以访问node.js方法
const Store = window.require('electron-store') //electron提供的数据持久化类
const fileStore = new Store({'name': 'Files-Store-Data'})//实例化electron-store 设置本机存储文件
//保存文件至store中(文档数据库)
const saveFilesToStore = (files) => {
  //文件状态等信息 不需要存入 isNew, body, isOpened
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt} = file
    result[id] = {
      id,       //文件id
      path,     //文件路径
      title,    //文件标题
      createdAt //创建时间
    }
    return result
  }, {})
  fileStore.set('files', fileStoreObj)
}

function App() {
  //全局最小单元state
  const [ files, setFiles ] = useState(fileStore.get('files') || {})//读取本地文件
  const [ activeFileId, setActiveFileId ] = useState('')//当前编辑器打开展示的id(活跃文件id)
  const [ openedFilesIds, setOpenedFilesIds ] = useState([])//打开的文件id集合
  const [ unsavedFileIds, setUnsavedFileIds ] = useState([])//编辑状态未保存文件id集合
  const [ searchedFiles, setSearchedFiles ] = useState([])//搜索文件列表结果集合
  const saveLocation = remote.app.getPath('documents') // documents代表操作系统我的文档路径
  //const fs = window.require('fs') //node.js提供的和本地文件交互的方法 file system
  
  const filesArr = objToArr(files)
  //获取通过打开的文件id集合匹配打开的对应文件
  const openedFiles = openedFilesIds.map(openID => {
    return files[openID]
  })
  //获取当前编辑器打开展示的文件(活跃文件)
  const activeFile = files[activeFileId]
  //定义文件列表集合
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr

  /**
   * 反向数据流 各操作事件/方法app.js返回相应的数据到组件中处理
  */
  //左侧菜单---搜索文件列表
  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  //左侧菜单---点击左侧文件列表方法
  const fileClick = (fileId) => {
    //设置活跃文件id
    setActiveFileId(fileId)
    //添加isLoad状态 避免重复读取文件
    const currentFile = files[fileId]
    if(!currentFile.isLoaded){
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileId], body: value, isLoaded: true}
        setFiles( { ...files, [fileId]: newFile} )
      })
    }
    //设置打开文件id集合
    if(!openedFilesIds.includes(fileId)){
      //只有当前集合内不包含该id才能添加
      setOpenedFilesIds([ ...openedFilesIds, fileId ])
    }
    //设置文件打开状态
    const modifiedFile = { ...files[fileId], isOpened: true }
    setFiles({ ...files, [fileId]: modifiedFile})
  }

  //左侧菜单---删除文件
  const deleteFile = (id) => {
    //判断文件是否存在 isNew文件不需要删除并持久化
    if(files[id].isNew){
      const { [id]: value, ...afterDelete } = files
      //delete files[id]
      setFiles(afterDelete)
    } else {
      fileHelper.deleteFile( files[id].path ).then(() => {
        //const { [id]: value, ...afterDelete } = files
        delete files[id]
        setFiles({ ...files })
        //持久化文件到本地
        saveFilesToStore(files)
        //同时关闭tab页签
        tabClose(id)
      })
    }
  }

  //左侧菜单---编辑文件名称
  const saveEdit = (id, title, isNew) => {
    const newPath = isNew ? join(saveLocation, `${title}.md`) 
    : join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath}
    const newFiles = { ...files, [id]: modifiedFile} 
    if(isNew){
      //新创建文件调用保存编辑方法后需要同步保存文件到本地
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        //持久化文件
        saveFilesToStore(newFiles)
      })
    }else{
      //非新创建文件及执行重命名操作
      const oldPath = files[id].path
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        //持久化文件
        saveFilesToStore(newFiles)
      })
    }
    
  }

  //左侧菜单---新建文件
  const createFile = () => {
    const uuid = uuidv4()
    const newFile = {
      id: uuid,
      title: '',
      body: '## 我的文档',
      createdAt: new Date().getTime(),
      isNew: true,
      isOpened: false
    }
    setFiles({ ...files, [uuid]: newFile })
  }

  //左侧菜单---导入文件
  const importFiles = () => {
    remote.dialog.showOpenDialog({
      //选择导入文件
      title: '选择 .md 格式文件导入',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Markdown files', extensions: ['md'] }
      ]
    }, (paths) => {
      if (Array.isArray(paths)){
        //过滤已经存在的文件
        const filteredPath = paths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => {
            return file.path === path
          })
          return !alreadyAdded
        })
        //扩展完善路径数组 id tile path 
        const importFileArr = filteredPath.map(path => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            createdAt: new Date().getTime(),
            path
            
          }
        })
        //设置新文件
        const newFiles = { ...files, ...flattenArr(importFileArr) }
        //持久化文件
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        //设置导入成功提示
        if (importFileArr.length > 0 ){
          remote.dialog.showMessageBox({
            type: 'info',
            title: '导入成功',
            message: `成功导入${importFileArr.length}个文件`
          })
        } else{
          remote.dialog.showMessageBox({
            type: 'info',
            title: '导入失败',
            message: '请检查文件是否已存在'
          })
        }
      }
    })
  }

  //右侧tab页---点击右侧tab页签方法
  const tabClick= (fileId) => {
    //设置活跃文件id
    setActiveFileId(fileId)
  }

  //右侧tab页---关闭右侧tab页签方法
  const tabClose = (id) => {
    //重新设置打开文件id集合
    const tabWithoutCurrentIds = openedFilesIds.filter(openId => openId !== id )
    setOpenedFilesIds(tabWithoutCurrentIds)
    //并且设置打开的文件数组的第一个文件id为活跃文件id
    if(tabWithoutCurrentIds.length > 0 ){
      setActiveFileId(tabWithoutCurrentIds[0])
    }else{
      setActiveFileId('')
    }
    //从未保存文件中清除
    if(unsavedFileIds.includes(id)){
      const unsaveWithoutCurrentIds = unsavedFileIds.filter(unsaveFileId => unsaveFileId !== id)
      setUnsavedFileIds(unsaveWithoutCurrentIds)
    }
    //设置文件打开状态 (删除文件调用该方法时 不需要设置状态)
    const filesArr = objToArr(files)
    const isExistFile = filesArr.find(file => file.id === id)
    if(isExistFile){
      const modifiedFile = { ...files[id], isOpened: false }
      setFiles({ ...files, [id]: modifiedFile})
    }
  }

  //编辑器---编辑文件(文件内容发生变更)
  const fileChange = (id, value) => {
    //更新文件内容
    const newFile = { ...files[id], body: value }
    setFiles({ ...files, [id]: newFile })
    //更新未保存文件id
    if(!unsavedFileIds.includes(id)){
      setUnsavedFileIds([ ...unsavedFileIds, id ])
    }
  }

  //编辑器---保存当前文件的编辑
  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path,
       activeFile.body
    ).then(() => {
      setUnsavedFileIds(unsavedFileIds.filter(id => id !== activeFile.id))
    })
  }

  return (
    //container-fluid 栅格布局以12划分 根据编辑器布局定义raw 
    <div className="App container-fluid px-0">  
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
            <FileSearch 
              title = "我的文档"
              onFileSearch = {fileSearch}
            />
            <FileList 
              files={fileListArr}
              onFileDelete = {deleteFile}
              onFileClick = {fileClick}
              onSaveEdit = {saveEdit}
            />
            <div className="row button-group no-gutters">
              <div className="col">
                <BottomBtn 
                  text = "新建"
                  colorClass="btn-primary"
                  icon = {faPlus}
                  onBtnClick = {createFile}
                />
              </div> 
              <div className="col">
                <BottomBtn 
                  text = "导入"
                  colorClass="btn-success"
                  icon = {faFileImport}
                  onBtnClick = {importFiles}
                />
              </div> 
            </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile &&
            <div className='start-page'>
                请点击打开文档或创建新文档
              </div>
          }
          { activeFile &&
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileId}
                unsaveIds={unsavedFileIds}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
            <SimpleMDE 
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {fileChange(activeFile.id, value)}}
                options={{
                  minHeight: '515px',
                }}
              />
              <BottomBtn 
                  text = "保存"
                  colorClass="btn-secondary"
                  icon = {faSave}
                  onBtnClick = {saveCurrentFile}
                />
            </>
          }
          </div>
      </div>
    </div>
  );
}

export default App;
