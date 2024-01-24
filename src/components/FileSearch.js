//左侧菜单-文档搜索组件
import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { PropTypes } from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

const FileSearch = ({ title, onFileSearch}) => {
    const [ inputActive, setInputActive ] = useState(false) //是否输入状态
    const [ value, setValue ] = useState('') //输入内容
    const enterPress = useKeyPress(13) //enter键位
    const escPress = useKeyPress(27) //esc键位
    let node = useRef(null)

    useEffect(() => {
        if(enterPress && inputActive){
            onFileSearch(value)
        }
        if(escPress && inputActive){
            closeSearch()
        }
    })

    useEffect(() =>{
        //添加点击搜索后光标聚焦搜索框事件
        if(inputActive){
            node.current.focus()
        }
    },[inputActive])

    //定义关闭搜索框事件
    const closeSearch = () => {
        //阻止默认行为
        //e.preventDefault()
        setInputActive(false)
        setValue('')
    }

    return (
        <div className="alert alert-primary d-flex justify-content-between align-items-center bg-primary">
            {
                !inputActive && 
                <>
                    <span style={{ height: '30px', color: '#FFFFFF', fontWeight: 'bolder' }}>{title}</span>
                    <button
                        type="button"
                        className="icon-button"
                        onClick={() =>{setInputActive(true)}}
                    >    
                    <FontAwesomeIcon icon={faMagnifyingGlass} title="搜索" size="lg" />
                    </button>
                </>
            }
            {
                inputActive && 
                <>
                    <input 
                        type='text' 
                        placeholder="请输入内容"
                        className="form-control"
                        value={value}
                        onChange= {(e)=>{setValue(e.target.value)}}
                        ref= {node}
                        style={{ height: '30px' }}
                    >
                    </input>
                    <button
                        type="button"
                        className="icon-button"
                        onClick={closeSearch}
                    >
                    <FontAwesomeIcon icon={faXmark} title="关闭" size="lg" />
                    </button>
                </>
            }
        </div>
    )
}

//增加react自带的prop-types属性检查
FileSearch.propTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired
}
//增加默认参数
FileSearch.defaultProps = {
    title: '我的文档'
}


export default FileSearch