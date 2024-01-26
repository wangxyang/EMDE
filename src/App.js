import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'

import { faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons'

import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFile';
import BottomBtn from './components/BottomBtn';
import SimpleMDE from "react-simplemde-editor"
import TabList from './components/TabList';
import { flattenArr, objToArr } from './utils/helper'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

function App() {
  //全局最小单元state
  const [ files, setFiles ] = useState(flattenArr(defaultFiles))//读取本地文件
  const [ activeFileId, setActiveFileId ] = useState('')//当前编辑器打开展示的id(活跃文件id)
  const [ openedFilesIds, setOpenedFilesIds ] = useState([])//打开的文件id集合
  const [ unsavedFileIds, setUnsavedFileIds ] = useState([])//编辑状态未保存文件id集合
  const [ searchedFiles, setSearchedFiles ] = useState([])//搜索文件列表结果集合

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
    delete files[id]
    setFiles(files)
    //同时关闭tab页签
    tabClose(id)
  }
  //左侧菜单---编辑文件名称
  const saveEdit = (id, title) => {
    const modifiedFile = { ...files[id], title, isNew: false }
    setFiles({ ...files, [id]: modifiedFile})
    
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
      isOpened:false,
    }
    setFiles({ ...files, [uuid]: newFile })
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
    //设置文件打开状态
    const modifiedFile = { ...files[id], isOpened: false }
    setFiles({ ...files, [id]: modifiedFile})
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
            </>
          }
          </div>
      </div>
    </div>
  );
}

export default App;
