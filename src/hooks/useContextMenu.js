import { useEffect } from 'react';

const { remote } = window.require('electron')//remote是electron提供的renderer.js可以访问node.js方法
const { Menu, MenuItem } = remote //导入原生应用菜单

/**
 * 自定义hook 创建上下文菜单
 * @param {菜单项属性} itemArr 
 */
const useContextMenu = (itemArr) => {
    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            //循环设置上下文菜单中的菜单项
            menu.append(new MenuItem(item))
        });
        const handleContextMenu = (e) => {
            //唤起上下文菜单
            menu.popup( { window: remote.getCurrentWindow() } ) 
        }
        window.addEventListener('contextmenu', handleContextMenu)
        return () =>{
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])
}

export default useContextMenu