//左侧菜单-文件列表组件
import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBan, faNewspaper} from '@fortawesome/free-solid-svg-icons'
import { PropTypes } from "prop-types";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete}) => {
    return (
        <ul className="list-group list-group-flush file-list ">
            {
                files.map(file => (
                    <li 
                        className="row list-group-item bg-light d-flex justify-content-between align-items-center "
                        key={file.id}
                    >
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
                            onClick={() => {}}
                        >
                            <FontAwesomeIcon icon={faPen} title="编辑"/>
                        </button>
                        <button
                            type="button"
                            className="icon-button col-2"
                            onClick={() => {}}
                        >
                            <FontAwesomeIcon icon={faBan} title="删除" />
                        </button> 
                    </li>
                ))
            }
        </ul> 
    )
}

FileList.propTypes = {
    files: PropTypes.array
}

export default FileList