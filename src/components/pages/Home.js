import React, {useEffect, useContext} from 'react'
import BookmarkForm from '../bookmark/BookmarkForm'
import CategoryBoxes from '../bookmark/CategoryBoxes'
import AuthContext from '../../context/auth/authContext'
import BookmarkContext from '../../context/bookmark/bookmarkContext'

const Home = () => {

    const authContext = useContext(AuthContext);
    const bookmarkContext = useContext(BookmarkContext)
    const {loadUser, authorizing, tokenVerification, firebaseUser, authorizeUser, checkFirebaseAuth} = authContext
    const { checkLocalBookmarks } = bookmarkContext

    useEffect(() => {
        if (!authorizing && !firebaseUser) {
                checkFirebaseAuth()
                loadUser()
        }
      //eslint-disable-next-line
    }, [])
    
    useEffect(() => {
        if(authorizing){            
            tokenVerification()   
        }         
        //eslint-disable-next-line
      }, [authorizing])
    
      useEffect(() =>{
        if(firebaseUser){
            authorizeUser(firebaseUser)
            checkLocalBookmarks()
        }
                //eslint-disable-next-line
      }, [authorizeUser, firebaseUser])

    return (
        <div className="content-container">
            <BookmarkForm />
            {authorizing ? 
              (<h5 className="text-center" style={{color: '#f1c40f'}}>Authorizing You...</h5>) : 
              (firebaseUser ? (<h5 style={{color: '#27ae60'}} className="text-center">Authorizing You...</h5>) : (<CategoryBoxes />))}
            
        </div>
    )
}

export default Home
