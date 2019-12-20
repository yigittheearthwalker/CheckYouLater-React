import React, {useReducer} from 'react'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import axios from 'axios'
import AuthContext from './authContext'
import authReducer from './authReducer'
import setAuthToken from '../../utils/setAuthToken'
import {
  AUTHORIZING,
  AUTHORIZING_2,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../types'

firebase.initializeApp(firebaseConfig);


const AuthState = (props) => {

    const initialState = {
        token: localStorage.getItem('token'),
        authorizing: false,
        result: null,
        firebaseUser: null,
        isAuthenticated: null,
        bookmarksToDatabase: false,
        loading: true,
        user: null,
        error: null,
      }

      const [state, dispatch] = useReducer(authReducer, initialState);

    /******************************************************************************* */
    /****************  AUTHORIZATION STARTS FIREBASE/LOCAL  ************************* */
    /******************************************************************************* */

    //Starting the FireBase Auth Process coming from the Login Modal
      const authStart = (provider) => {
        switch(provider){
          case 'google':
            return firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
          case 'facebook':
            return firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider())
          default:
              return firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())

        }
      }
    // Receive the redirected user token from firebase and send it for authorizin locally
    
    
    const checkFirebaseAuth = () => {
      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          
          dispatch({
            type: AUTHORIZING,
            payload: result
          })

        }
      }).catch(function(error) {
        console.log('Error Code: '+error.code+' Error Message '+error.message);    
      });
    }
      

      const tokenVerification = () => {
        firebase.auth().currentUser.getIdToken(false).then(function(idToken) {
          if (idToken) {
            const firebaseUser = {
              token: idToken,
              id: state.result.additionalUserInfo.profile.id
            }
            
            dispatch({
              type: AUTHORIZING_2,
              payload: firebaseUser
            })            
            
          }else{
            console.log('No ID Token');
            
          }
          
        }).catch(function(error) {
         console.log(error);
         
        })
      }
          


      //Authorize the user coming from Firebase
      const authorizeUser = async (firebaseUser) => { 
        const config  = {
          headers: {
            'Content-Type': 'application/json'
          }
        }      

        try {
          const res = await axios.post('/auth/identify', firebaseUser, config)         
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
          })     
          loadUser()
          firebaseSignOut() //After the local authorization, we sign out from firebase
        } catch (err) {        
          console.log(err.response);
          dispatch({
            type: LOGIN_FAIL,
            payload: err.response.data.msg
          })
          firebaseSignOut() //After the local authorization, we sign out from firebase
        }
      }
    /******************************************************************************* */
    /****************   AUTHORIZATION ENDS FIREBASE/LOCAL  ************************* */
    /******************************************************************************* */

    //Load User

    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token)
        
      }else{        
      }
      try {
        const res = await axios.get('/auth/user');
                
        dispatch({
          type: USER_LOADED,
          payload: res.data
        })
      } catch (err) {
        dispatch({
          type: AUTH_ERROR
        })
      }
    }

    //Local Logout
     const logout = () => {
      dispatch({
        type: LOGOUT
      })
     } 
    //Firebase Sign Out
      const firebaseSignOut = () => {
        firebase.auth().signOut()
      }


    return (
        <AuthContext.Provider
        value={{
          token: state.token,
          authorizing: state.authorizing,
          result: state.result,
          firebaseUser: state.firebaseUser,
          isAuthenticated: state.isAuthenticated,
          bookmarksToDatabase: state.bookmarksToDatabase,
          loading: state.loading,
          user: state.user,
          error: state.error,
          logout,
          checkFirebaseAuth,
          loadUser,
          authorizeUser,
          firebaseSignOut,
          authStart,
          tokenVerification
        }}>
             {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState

