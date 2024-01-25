import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBan, faNewspaper, faXmark, faCheck} from '@fortawesome/free-solid-svg-icons'
import { PropTypes } from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

/**
 * 左侧菜单-文件列表组件
 * @param {文档列表} files 
 * @param {点击文件} onFileClick 
 * @param {保存编辑} onSaveEdit 
 * @param {删除文件} onFileDelete 
 * @returns 
 */
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [ editStatus, setEditStatus] = useState(false)
    const [ value, setValue ] = useState('')
    const enterPress = useKeyPress(13) //enter键位
    const escPress = useKeyPress(27) //esc键位
    let node = useRef(null)
    
    //关闭重命名编辑器
    const cancleEdit = (editItem) => {
        //event.preventDefault()
        setEditStatus(false)
        setValue('')
        //如果当前文件是新建文件退出时需要删除当前文件
        if(editItem.isNew){
            onFileDelete(editItem.id)
        }
    }

    //完成重命名编辑
    const completeEdit = () => {
        //event.preventDefault()
        setEditStatus(false)
        setValue('')
    }

    useEffect(() =>{
        //添加点击搜索后光标聚焦搜索框事件
        if(editStatus){
            node.current.focus()
        }
    },[editStatus])

    useEffect(() => {
        const editItem = files.find(file => file.id === editStatus)
        if(enterPress && editStatus && value.trim() !== ''){
            //通过编辑状态id找到对应正在编辑的文件
            onSaveEdit(editItem.id, value)
            //完成编辑
            completeEdit()
        }
        if(escPress && editStatus){
            //取消编辑
            cancleEdit(editItem)
        }
    },[enterPress, escPress])

    //新增文件重新设置
    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        if(newFile){
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [files])

    return (
        <ul className="list-group list-group-flush file-list ">
            {
                files.map(file => (
                     
                    <li 
                        className="row list-group-item bg-light d-flex justify-content-between align-items-center mx-0"
                        key={file.id}
                    >
                        {
                            ((file.id !== editStatus) && !file.isNew) &&
                            <> 
                                <span className="col-2" size='lg'>
                                    <FontAwesomeIcon icon={faNewspaper} size="lg" />
                                </span>
                                <span 
                                    className="col-6 c-link"
                                    onClick={() => {onFileClick(file.id)}}
                                >
                                    {file.title}
                                </span>   
                                <button
                                    type="button"
                                    className="icon-button col-2"
                                    onClick={() => {setEditStatus(file.id); setValue(file.title)}}
                                >
                                    <FontAwesomeIcon icon={faPen} title="编辑"/>
                                </button>
                                <button
                                    type="button"
                                    className="icon-button col-2"
                                    onClick={() => {onFileDelete(file.id)}}
                                >
                                    <FontAwesomeIcon icon={faBan} title="删除" />
                                </button> 
                            </>
                        }
                        {
                             ((file.id === editStatus) && file.isNew) &&
                             <> 
                                 <input
                                    className="col -8"
                                    type="text"
                                    value={value}
                                    ref={node}
                                    onChange={(e) => {setValue(e.target.value)}}
                                    placeholder="请输入文件名称"
                                 >
                                 </input>
                                 <button
                                     type="button"
                                     className="icon-button col-2"
                                     onClick={() => {setEditStatus(false); onSaveEdit(file.id, value)}}
                                 >  
                                    {   
                                        //仅当输入的value不为空 才出现确定
                                        value.trim() !== '' &&
                                        <FontAwesomeIcon icon={faCheck} title="确定"/>
                                    }
                                 </button>
                                 <button
                                     type="button"
                                     className="icon-button col-2"
                                     onClick={() => {cancleEdit(file)}}
                                 >
                                     <FontAwesomeIcon icon={faXmark} title="取消"/>
                                 </button>
                             </>
                        }
                    </li>
                ))
            }
        </ul> 
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func,
}

export default FileList