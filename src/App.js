import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch';

function App() {
  return (
    //container-fluid 栅格布局以12划分 根据编辑器布局定义raw 
    <div className="App container-fluid">  
      <div className='row'>
        <div className='col-3 bg-light left-panel'>
            <FileSearch 
              title = '我的文档'
              onFileSearch = {(value) => {console.log(value)}}
            />
        </div>
        <div className='col-9 bg-info right-panel'>
            col-9 
        </div>
      </div>
    </div>
  );
}

export default App;
