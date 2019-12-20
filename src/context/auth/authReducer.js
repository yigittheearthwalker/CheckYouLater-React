import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    AUTHORIZING,
    AUTHORIZING_2
  } from '../types'

export default (state, action) => {
    switch (action.type){
        case AUTHORIZING:
            return{
                ...state,
                authorizing: true,
                result: action.payload
            }
        case AUTHORIZING_2:
            return{
                ...state,
                authorizing: false,
                result: null,
                firebaseUser: action.payload
            }
        case USER_LOADED:
            return{
                ...state,
                authorizing: false,
                isAuthenticated: true,
                firebaseUser: null,
                loading: false,
                user: action.payload,
                bookmarksToDatabase: action.payload.bookmarksToDatabase
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return{
                ...state,
                ...action.payload,
                authorizing: false,
                firebaseUser: null,
                isAuthenticated: true,
                bookmarksToDatabase: action.payload.bookmarksToDatabase,
                loading: false
            }
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
            localStorage.removeItem('token')
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                authorizing: false,
                result: null,
                firebaseUser: null,
                bookmarksToDatabase: false,
                loading: false,
                user: null,
                error: action.payload 
            }    
        default:
            return state
    }
}