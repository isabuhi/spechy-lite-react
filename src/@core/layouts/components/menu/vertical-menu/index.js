// ** React Imports
import { Fragment, useState, useRef } from 'react'
import {  useSelector } from 'react-redux'
// ** Vertical Menu Items Array
import navigation from '@src/navigation/vertical'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'
import {Mail, Home, Key, Menu} from 'react-feather'
import * as Icons from 'react-feather'

const Sidebar = props => {
  // ** Props
  const { menuCollapsed, routerProps, menu, currentActiveItem, skin } = props
  const navigationServer = useSelector(state=>state.menu)
  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    if (menuCollapsed) {
      setMenuHover(true)
    }
  }

  // ** Scroll Menu
  const scrollMenu = container => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else {
      if (shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.remove('d-block')
      }
    }
  }
  //console.log(navigationServer.menu)
  let newMenu = []
  for(let i=0;i<navigationServer.menu.length;i++)
  {
    if(navigationServer.menu[i].top_id === 0)
    {
      let childs = []
      for(let j=0;j<navigationServer.menu.length;j++)
      {
        if(navigationServer.menu[j].top_id === navigationServer.menu[i].menu_id)
        {
          //console.log('children of : ' , navigation.menu[i].name , "child is : " , navigation.menu[j].name)
          childs.push({
            id : navigationServer.menu[j].name,
            title : navigationServer.menu[j].name,
            navLink : navigationServer.menu[j].path,
            icon : <Home size={20} />,
          })
        }
      }
      if(childs.length > 0)
      {
        let icon = `<Icons.${navigationServer.menu[i].icon} size={12} />`;
        newMenu.push({
          id : navigationServer.menu[i].name,
          title : navigationServer.menu[i].name,
          navLink : navigationServer.menu[i].path,
          icon : icon,
          'children' : childs,
        })
      }
      else
      {
        newMenu.push({
          id : navigationServer.menu[i].name,
          title : navigationServer.menu[i].name,
          navLink : navigationServer.menu[i].path,
          icon : <Home size={20} />,
        })
      }
    }
  }
  //console.log(newMenu)
  return (
    <Fragment>
      <div
        className={classnames('main-menu menu-fixed menu-accordion menu-shadow', {
          expanded: menuHover || menuCollapsed === false,
          'menu-light': skin !== 'semi-dark' && skin !== 'dark',
          'menu-dark': skin === 'semi-dark' || skin === 'dark'
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
            {/* Vertical Menu Header Shadow */}
            <div className='shadow-bottom' ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className='main-menu-content'
              options={{ wheelPropagation: false }}
              onScrollY={container => scrollMenu(container)}
            >
              <ul className='navigation navigation-main'>
                <VerticalNavMenuItems
                  items={navigation}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />
              </ul>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Sidebar
