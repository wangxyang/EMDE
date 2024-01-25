import {useState} from "react";
/**
 * 更新文件内容自定义hook
 * @param {修改文件集合} files 
 * @param {更新文件} updateFile 
 * @returns 
 */
const useFileUpdate = ( updateFiles, updateFile ) => {
    const [ files, setFiles] = useState([])

    const newFiles = updateFiles.map(file => {
        if(file.id === updateFile.id){
            file.title = updateFile.title 
            file.body = updateFile.body
            return file
        }
        setFiles(newFiles)
    })
    return files
}

export default useFileUpdate