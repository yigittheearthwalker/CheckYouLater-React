import React, {useContext, useEffect} from 'react'
import BookmarkBoxes from '../bookmark/BookmarkBoxes'
import AuthContext from '../../context/auth/authContext'
import BookmarkContext from '../../context/bookmark/bookmarkContext'

const Category = ({match}) => {

    const authContext = useContext(AuthContext)
    const bookmarkContext = useContext(BookmarkContext)
    const {loadUser, isAuthenticated, bookmarksToDatabase} = authContext
    const {categories, getBookmarks, categoryIds} = bookmarkContext    

    useEffect(() => {
        loadUser()
        getBookmarks(isAuthenticated, bookmarksToDatabase)        
        //eslint-disable-next-line
      }, [isAuthenticated, bookmarksToDatabase])

    return (
        <div className="content-container">
            {categories.map((category, i) => (category._id ? (category._id === match.params.id && ( <BookmarkBoxes key={i} category={category} categoryIds={categoryIds}/>)) : 
            (category.localCategoryId === match.params.id && (<BookmarkBoxes key={i} category={category} />))))}
        </div>
    )
}

export default Category
