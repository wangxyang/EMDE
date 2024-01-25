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
import { useState } from 'react';

function App() {
  //应用数据流
  const [ files, setFiles] = useState(defaultFiles)//读取本地文件
  const [ activeFileId, setActiveFileId ] = useState('')//当前编辑器打开展示的id(活跃文件id)
  const [ openedFilesIds, setOpenedFilesIds ] = useState([])//打开的文件id集合
  const [ unsavedFileIds, setUnsavedFileIds ] = useState([])//编辑状态未保存文件id集合

  //通过打开的文件id集合匹配打开的对应文件
  const openFiles = openedFilesIds.map(openId => {
    return files.find(file => file.id === openId)
  })

  //当前编辑器打开展示的文件(活跃文件)
  const activeFile = files.find(file => file.id === activeFileId)

  return (
    //container-fluid 栅格布局以12划分 根据编辑器布局定义raw 
    <div className="App container-fluid px-0">  
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
            <FileSearch 
              title = "我的文档"
              onFileSearch = {(value) => {console.log(value)}}
            />
            <FileList 
              files={files}
              onFileDelete = {(id) => {console.log(id)}}
              onFileClick = {(id) => {console.log(id)}}
              onSaveEdit = {(id, newValue) => {console.log(id, newValue)}}
            />
            <div className="row button-group no-gutters">
              <div className="col">
                <BottomBtn 
                  text = "新建"
                  colorClass="btn-primary"
                  icon = {faPlus}
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
                files={openFiles}
                activeId={activeFileId}
                unsaveIds={unsavedFileIds}
                onTabClick={(id) => {console.log(id)}}
                onCloseTab={(id) => { console.log('closing', id)}}
              />
            <SimpleMDE 
                value={activeFile && activeFile.body}
                onChange={(value) => {console.log(value)}}
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
