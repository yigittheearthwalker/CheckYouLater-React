import React, {Fragment} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/pages/Home'
import Category from './components/pages/Category'
import BookmarkState from './context/bookmark/BookmarkState'
import AuthState from './context/auth/AuthState'
import Modal from './components/layout/Modal'
import ModalState from './context/modal/ModalState'
import './App.css';
import './App-media.css'


const App = () => {
 
  return (
    <AuthState>
    <BookmarkState>
    <ModalState>
    <Router>
    <Fragment>
      <Modal show={true}/>
      <Header />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/category/:id' component={Category} />
          </Switch>
      <Footer />
    </Fragment>
    </Router>
    </ModalState>
    </BookmarkState>
    </AuthState>
  );
}

export default App
