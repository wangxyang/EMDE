import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFile';
import defaultFiles2 from './utils/defaultFile2';
import BottomBtn from './components/BottomBtn';
import { faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor"
import 'easymde/dist/easymde.min.css'
import TabList from './components/TableList';

function App() {
  return (
    //container-fluid 栅格布局以12划分 根据编辑器布局定义raw 
    <div className="App container-fluid px-0">  
      <div className="row no-gutters">
        <div className="col-3 bg-secondary left-panel">
            <FileSearch 
              title = "我的文档"
              onFileSearch = {(value) => {console.log(value)}}
            />
            <FileList 
              files={defaultFiles}
              onFileDelete = {(id) => {console.log(id)}}
              onFileClick = {(id) => {console.log(id)}}
              onSaveEdit = {(id, newValue) => {console.log(id, newValue)}}
            />
            <div className="row no-gutters">
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
          <TabList
            files={defaultFiles2}
            activeId="1"
            onTabClick={(id) => {console.log(id)}}
          />
        <SimpleMDE 
            value={defaultFiles[1].body}
            onChange={(value) => {console.log(value)}}
            options={{
              minHeight: '515px',
            }}
          />
          </div>
      </div>
    </div>
  );
}

export default App;
