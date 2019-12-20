import React, {useContext, useRef, useEffect, useState} from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext'
import ModalContext from '../../context/modal/modalContext'
import BookmarkContext from '../../context/bookmark/bookmarkContext';

const Header = () => {

    const authContext = useContext(AuthContext)
    const modalContext = useContext(ModalContext)
    const bookmarkContext = useContext(BookmarkContext)
  
    const {setModal} = modalContext
    const { isAuthenticated, logout} = authContext
    const {filterCategories, filteredCategories, filteredBookmarks, filteredURLs, clearFilter} = bookmarkContext

    const asklogin = () => {  
        const modal = {
          modalSize: 'lg',
          modalTitle: 'Select your login method',
          modalBody: '',
          hasCustomBody: true,
          customBodyName: 'login',
          hasCustomModalFooter: false,
          onModalSubmit: '',
          objectToPass: null
      }
        setModal(modal)    
      }
      const onSettings = () => {
        const modal = {
          modalSize: 'lg',
          modalTitle: 'CheckYouLater Settings',
          modalBody: '',
          hasCustomBody: true,
          customBodyName: 'settings',
          hasCustomModalFooter: true,
          onModalSubmit: '',
          objectToPass: null
      }
        setModal(modal)    
      }
    
      const onLogout = () => {
        logout()
      }

      const text = useRef('')

  useEffect(() => {
    if (filteredCategories === null || filteredBookmarks ===null || filteredURLs === null) {
      if(clicked){text.current.value = ''}
      
    } 
        //eslint-disable-next-line
  })

  const onChange = e => {
    if(text.current.value !== ''){
      filterCategories(e.target.value)
    }else{
      clearFilter()
    }
  }

  const [menu, setMenu] = useState({
     clicked: false
  })

  const {clicked} = menu

  const showThings = () => {
    if(!clicked){
      setMenu({clicked: true})
    }else{
      setMenu({clicked: false})
    }
      
  }

    return (
      <div className="header">
        <Navbar >
            <Navbar.Brand className="mr-auto logo-wrapper">
              <a href="/">
            <img className="big-header-logo" src="https://i.ibb.co/Rbf8yTY/fulllogo.png" alt="" />
            <img className="small-header-logo" src="https://i.ibb.co/zh8nkT9/emptylogo.png" alt="" /></a>
            </Navbar.Brand>
            <Nav className="nav-things">   
                <Form inline className="filter-form">
                <FormControl className="mr-2" 
                    placeholder="Search..."
                    aria-label="Username"
                    onChange={onChange}
                    ref={text}
                />
                </Form>
                { (!isAuthenticated) ?
                  (
                  <ul className="nav nav-btns justify-content-end text-right">
                  <li><Button variant="info" className="btn" onClick={asklogin}>Login</Button></li>
                  </ul>
                  ) : (
                  <ul className="nav nav-btns justify-content-end text-right">
                  <li><Button variant="info" type="button" className="btn mr-2" onClick={onSettings} ><i className="fas fa-cog" /> </Button></li>
                  <li><Button type="button" variant="info" className="btn" onClick={onLogout} ><i className="fas fa-sign-out-alt" /> </Button></li>           
                  </ul>
                  )}
                  </Nav>
                   <Button variant="info" type="button" className="btn show-menu justify-content-end" onClick={showThings} ><i className="fas fa-bars"></i></Button>
                   </Navbar>
                   {clicked && ( 
                  
                          <Navbar className="secret-nav" >  
                        <Nav className="justify-content-center">
                        <Form inline className="filter-form">
                        <FormControl size="sm" className="mr-2" 
                            placeholder="Search..."
                            aria-label="Username"
                            onChange={onChange}
                            ref={text}
                        />
                        </Form>
                        { (!isAuthenticated) ?
                          (
                          <ul className="nav justify-content-end text-right">
                          <li><Button size="sm" variant="info" className="btn" onClick={asklogin}>Login</Button></li>
                          </ul>
                          ) : (
                          <ul className="nav justify-content-end text-right">
                          <li><Button variant="info" size="sm" type="button" className="btn mr-2" onClick={onSettings} ><i className="fas fa-cog" /> </Button></li>
                          <li><Button variant="info" size="sm" type="button" className="btn" onClick={onLogout} ><i className="fas fa-sign-out-alt" /> </Button></li>           
                          </ul>
                          )}
                          </Nav>
                          </Navbar>
                        
                        
                   )}
                       
        
        </div>
    )
}

export default Header
