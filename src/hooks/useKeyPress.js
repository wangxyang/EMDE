import React,{useState, useEffect} from "react";

/**
 * 键盘操作自定义hook
 * @param {*} targetKeyCode  键盘键位
 */
const useKeyPress = (targetKeyCode) => {
    const [ keyPress, setKeyPress] = useState(false)

    //按下键位处理器
    const keyDownHandler = ({keyCode}) => {
        if(keyCode === targetKeyCode){
            setKeyPress(true)
        }
    }

    //放开键位处理器
    const keyUpHandler = ({keyCode}) => {
        if(keyCode === targetKeyCode){
            setKeyPress(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown',keyDownHandler )
        document.addEventListener('keyup',keyUpHandler )

        return () => {
            document.removeEventListener('keydown',keyDownHandler )
        document.removeEventListener('keyup',keyUpHandler )
        }
    }, [])
    return keyPress
}

export default useKeyPress