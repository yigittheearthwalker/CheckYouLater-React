import React, {useReducer, useContext} from 'react'
import BookmarkContext from './bookmarkContext'
import bookmarkReducer from './bookmarkReducer'
import setAuthToken from '../../utils/setAuthToken'
import AuthContext from '../auth/authContext'
import uuid from 'uuid/v4'
import axios from 'axios'
import {
  GET_BOOKMARKS,
  ADD_BOOKMARK,
  ADD_CATEGORY,
  DELETE_BOOKMARK,
  DELETE_CATEGORY,
  SORT_CATEGORIES,
  UPDATE_CATEGORY,
  FILTER_CATEGORIES,
  CLEAR_FILTER,
  ADJUST_SIZE,
  LOCAL_TO_DB
} from '../types'


const BookmarkState = props => {
    const initialState = {
        bookmarkCollection: {},
        categories: [],
        categoryIds: [],
        filteredCategories: null,
        filteredBookmarks: null,
        filteredURLs: null,
        error: null,
        showCat: null,
        categoriesToTransfer: false,
      }  
      const [state, dispatch] = useReducer(bookmarkReducer, initialState);

      const authContext = useContext(AuthContext)

      const { loadUser } = authContext
     
        
    /**************************       GET BOOKMARKS         ************************ */
    /**************************       GET BOOKMARKS         ************************ */
    /**************************       GET BOOKMARKS         ************************ */
    const getBookmarks = async (isAuthenticated, bookmarksToDatabase) => {
      
      //Bookmark Initializer function is defined first
      const bookmarkInitializer = (bookmarkCollection) => {
        let categoryIdList = [];
        if (bookmarkCollection.categories) {
          bookmarkCollection.categories.forEach((catId) => {
            if (catId._id) {
              categoryIdList.push({categoryId: catId._id, categoryName: catId.categoryName})
            } else if (catId.localCategoryId) {
              categoryIdList.push({categoryId: catId.localCategoryId, categoryName: catId.categoryName})
            }                  
          })    
        }
        let initializeBookmarks = {
          page: bookmarkCollection.categories,
          form: categoryIdList
        }      
        dispatch({
          type: GET_BOOKMARKS,
          payload: initializeBookmarks
        })
      }

      //Check if the user is authenticated then call initializer
      
      
  if(isAuthenticated && bookmarksToDatabase){    
    if (localStorage.token) {
      setAuthToken(localStorage.token)
      
    }
    try {
      const res = await axios.get('/api/bookmarks')
      
      if(res.data.bookmarkCollection){
        bookmarkInitializer(res.data.bookmarkCollection)
      }
    } catch (err) {
      console.log(err.response);
      
     /*dispatch({
        type: BOOKMARK_ERR,
        payload: err.response.msg
      })*/
    }
  }else{
    const bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))  
    if(bookmarkCollection) {
      bookmarkInitializer(bookmarkCollection)
    }
  }

}

    /**************************       ADD BOOKMARK         ************************ */
    /**************************       ADD BOOKMARK         ************************ */
    /**************************       ADD BOOKMARK         ************************ */

const addBookmark = (bookmark, bookmarksToDatabase) => {
  var colors = ["#FFF176", "#FFF9C4", "#e67e22", "#FFCC80", "#ec644b", "#ef9a9a", "#CE93D8", "#F3E5F5", "#26C6DA", "#4DB6AC", "#c5eff7", "#81C784", "#C8E6C9"] 
  const addBookmarkToLocal = () => {
    let newBookmark = { 
      localBookmarkId: uuid(),
      name: bookmark.name,
      url: bookmark.url,
      category: (bookmark.newCategory ? bookmark.newCategory : bookmark.category)
    } //new bookmmark is created as an object to be passed in a new or existing cathegory
    
    let bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))

    if (bookmarkCollection) { //If there is a bookmarkCollection object in LS, check if the category is new or existing
      if(bookmark.newCategory){//If it's a new category, proceed creating it
      let bookmarks = []
      bookmarks.push(newBookmark)
      let newCategory = {
        localCategoryId: uuid(),
        color: colors[Math.floor(Math.random() * colors.length)],
        categoryName: newBookmark.category,
        bookmarks: bookmarks
      }
      bookmarkCollection.categories.push(newCategory)
      localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
      const dispatchNewCat= {
        newCategory: newCategory,
        newCatIds: {categoryId: newCategory.localCategoryId, categoryName: newCategory.categoryName}
      }
      dispatch({
        type: ADD_CATEGORY,
        payload: dispatchNewCat
      })
      }else{ //if the category is existing, we locate it and push the newBookmark object inside        
        bookmarkCollection.categories.forEach((category, i) => {
          const lookForCatId = (category._id ? category._id : category.localCategoryId)
          if(lookForCatId === newBookmark.category){
            newBookmark['category'] = category.categoryName
            category.bookmarks.push(newBookmark)
            bookmarkCollection.categories.splice(i, 1, category)
            const dispatchNewBookmark = {
              category: category,
              index: i
            }
            dispatch({
              type: ADD_BOOKMARK,
              payload: dispatchNewBookmark
            })
          }
        })     
        localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))  
      }
      
    }else{ // In case there is no bookmarkCollection object in the localStorage...
      let categories = [];
      let bookmarks = []
      bookmarks.push(newBookmark)
      let newCategory = {
        localCategoryId: uuid(),
        color: colors[Math.floor(Math.random() * colors.length)],
        categoryName: newBookmark.category,
        bookmarks: bookmarks
      }
      categories.push(newCategory)
      bookmarkCollection = {
        localCollectionId: uuid(),
        categories: categories
      }
      localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))      
    }
    
  }// End of addBookmarksToLocal

  const addBookmarksToDB = async () => {
    const config  = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let newBookmark = { 
      isNewCategory: (bookmark.newCategory ? true : false),
      color: (bookmark.newCategory ? colors[Math.floor(Math.random() * colors.length)] : ''),
      name: bookmark.name,
      url: bookmark.url,
      category: (bookmark.newCategory ? bookmark.newCategory : bookmark.category)
    }
  
    try {
      const res = await axios.post('/api/bookmarks', newBookmark, config)

      const responseType = res.data.responseType
      
      if (responseType === 'bookmark') {
        
        dispatch({
          type: ADD_BOOKMARK,
          payload: res.data.response
        })
      }else if(responseType === 'category'){
        const dispatchNewCat= {
          newCategory: res.data.response,
          newCatIds: {categoryId: res.data.response._id, categoryName: res.data.response.categoryName}
        }
        
        dispatch({
          type: ADD_CATEGORY,
          payload: dispatchNewCat
        })
      }
      
    } catch (err) {
      console.log(err);
      
      /*dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg
      })*/
    }
    
  }
  if (!bookmarksToDatabase) {
    addBookmarkToLocal()
  }else{
    addBookmarksToDB()
  }

}      

    /**************************       DELETE BOOKMARK         ************************ */
    /**************************       DELETE BOOKMARK         ************************ */
    /**************************       DELETE BOOKMARK         ************************ */

    const deleteBookmark = (bookmarkToDelete) => {
      const bookmarkId = bookmarkToDelete.bookmarkId
      const categoryId = bookmarkToDelete.categoryId
      const deleteFromLocal = () => {
        let bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))
        if (bookmarkCollection) {
          let categories = bookmarkCollection.categories
          categories.forEach((category, i) => {
            const lookForCatId = (category._id ? category._id : category.localCategoryId)
            if (lookForCatId === categoryId) {
             let bookmarks = category.bookmarks
             bookmarks.forEach((bookmark, x) => {
               const lookForBookmarkId = (bookmark._id ? bookmark._id : bookmark.localBookmarkId)
               if(lookForBookmarkId === bookmarkId){
                if(bookmarks.length <= 1){
                  categories.splice(i, 1)
                  bookmarkCollection['categories'] = categories
                  localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection)) 
                  dispatch({
                    type: DELETE_CATEGORY,
                    payload: categoryId
                  })
                }else{
                  bookmarks.splice(x, 1)
                  category['bookmarks'] = bookmarks
                  categories.splice(i, 1, category)
                  bookmarkCollection['categories'] = categories
                  localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection)) 
                  dispatch({
                    type: DELETE_BOOKMARK,
                    payload: category
                  })
                }
               }
             }) 
            }
          })
        } else {
          console.log('No collection has been found!');
          
        }
      }
      const deleteFromDB = async () => {
        try {
      
         const res = await axios.delete('/api/bookmarks?type=bookmark&category='+categoryId+'&bookmark='+bookmarkId)
         if (res.data.deleted === 'category') {
          dispatch({
            type: DELETE_CATEGORY,
            payload: categoryId
          })
         } else if (res.data.deleted === 'bookmark') {
          dispatch({
            type: DELETE_BOOKMARK,
            payload: res.data.replace
          })
         }
        } catch (err) {
          /*dispatch({
            type: CONTACT_ERROR,
            payload: err.response.msg
          })*/
        }
      }
      if (!bookmarkToDelete.bookmarksToDatabase) {
        deleteFromLocal()
      } else if(bookmarkToDelete.bookmarksToDatabase) {   
        deleteFromDB()
      }
      
    }

    /**************************       EDIT CATEGORY         ************************ */
    /**************************       EDIT CATEGORY         ************************ */
    /**************************       EDIT CATEGORY         ************************ */

    const editCategory = (categoryUpdate, bookmarksToDatabase) => {

      const editCatLocal = () => {
        let bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))
        if (bookmarkCollection) {          
          let categories = bookmarkCollection.categories
          categories.forEach((category, i) => {
            const lookForCatId = (category._id ? category._id : category.localCategoryId)
            if(lookForCatId === categoryUpdate.categoryId){              
              if (!categoryUpdate.merge) {
                const newCategory = {
                  localCategoryId: categoryUpdate.categoryId,
                  color: categoryUpdate.color,
                  categoryName: categoryUpdate.categoryName,
                  bookmarks: category.bookmarks
                }
                categories.splice(i, 1, newCategory)
                bookmarkCollection['categories'] = categories
                localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
                const isAuthenticated = false
                getBookmarks(isAuthenticated, bookmarksToDatabase)
              } else {
                const holdBookmarks = category.bookmarks
                
                categories.forEach((catToMerge, x) => {
                  const lookForCatId = (category._id ? category._id : category.localCategoryId)
                  if(lookForCatId === categoryUpdate.merge){
                    const mergeBookmarks = catToMerge.bookmarks
                    const allBookmarks = mergeBookmarks.concat(holdBookmarks)
                    catToMerge['bookmarks'] = allBookmarks
                    categories.splice(x, 1, catToMerge)
                    categories.splice(i, 1)
                    bookmarkCollection['categories'] = categories
                    localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
                    const isAuthenticated = false
                    getBookmarks(isAuthenticated, bookmarksToDatabase)
                  }
                })
              }     
            }
          })
        } else {
          console.log('no category has been found');
          
        }
      }
      const editCatDB = async () => {
        const config  = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        try {
          const res = await axios.post('/api/category', categoryUpdate, config)

          console.log(res.data)
          dispatch({
            type: UPDATE_CATEGORY,
            payload: res.data.updatedCategory
          })
          if(res.data.removedCategory){
            dispatch({
              type: DELETE_CATEGORY,
              payload: res.data.removedCategory
            })
          }
          

        } catch (err) {
          
        }
      }

      if (!bookmarksToDatabase) {
        editCatLocal()          
      } else {   
        editCatDB()
      }
    } // Edit Category / End

    /**************************       SORT CATEGORIES        ************************ */
    /**************************       SORT CATEGORIES        ************************ */
    /**************************       SORT CATEGORIES        ************************ */

    const sortCategories = (categoryList, bookmarksToDatabase) => {
      const sortCatLocal = () => {
        let bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))

        if (bookmarkCollection) {
          bookmarkCollection['categories'] = categoryList
          localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
          
          dispatch({
            type: SORT_CATEGORIES,
            payload: categoryList
          })
        } else {
          console.log('Shame...');         
        }
      }
      
      const sortCatDB = async () => {
        const config  = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        let catIdList = []
        categoryList.map(category => 
          catIdList.push(category._id)
          )  

        try {
          const res = await axios.post('/api/sort', catIdList, config)

          if (res.data) {
            dispatch({
              type: SORT_CATEGORIES,
              payload: categoryList
            })
          } else {
            console.log('Shame...');
            
          }
     
        } catch (err) {
          console.log(err);    
        }
      
      }

      if (!bookmarksToDatabase) {        
        sortCatLocal()
      } else {
        sortCatDB()
      }
    }

    /**************************       FILTER CATEGORIES        ************************ */
    /**************************       FILTER CATEGORIES        ************************ */
    /**************************       FILTER CATEGORIES        ************************ */

    const filterCategories = (keyword) => {
      let filteredCategories = []

      state.categories.filter(category => {
        const regex = new RegExp(`${keyword}`, 'gi');
        if (category.categoryName.match(regex)){
           filteredCategories.push(category)
        }
        return true
      })

      let filteredBookmarks = []
      for (let i = 0; i < state.categories.length; i++) {
        const bookmarksToFilter = state.categories[i].bookmarks
        bookmarksToFilter.filter(bookmark => {
          const regex = new RegExp(`${keyword}`, 'gi');
          if(regex.exec(bookmark.name)){
             filteredBookmarks.push(bookmark)
          }
          return true
        })

      }
      let filteredURLs = []
      for (let i = 0; i < state.categories.length; i++) {
        const bookmarksToFilter = state.categories[i].bookmarks
        bookmarksToFilter.filter(bookmark => {
          const regex = new RegExp(`${keyword}`, 'gi');
          if(regex.exec(bookmark.url)){
             filteredURLs.push(bookmark)
          }
          return true
        })

      }
      
    dispatch({
      type: FILTER_CATEGORIES,
      payload: {filteredCategories: filteredCategories, filteredBookmarks: filteredBookmarks, filteredURLs: filteredURLs}
    })
    }
 // CLEAR THE FILTER
    const clearFilter = () => {
      dispatch({
        type: CLEAR_FILTER,
        payload: {filteredCategories: null, filteredBookmarks: null, filteredURLs: null}
      })
    }

//EXPAND CATEGORY WHEN SCREEN IS SMALL
    const expandCategory = (showCat) => {
      dispatch({
        type: ADJUST_SIZE,
        payload: showCat
      })
    }
  /**************************       TRANSFER CATEGORIES        ************************ */
  /**************************       TRANSFER CATEGORIES        ************************ */
  /**************************       TRANSFER CATEGORIES        ************************ */

  const checkLocalBookmarks = () => {
    const bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))

    if(bookmarkCollection){
      if (bookmarkCollection.categories || bookmarkCollection.categories.length > 0) {
        const categoriesToTransfer = true
        dispatch({
          type: LOCAL_TO_DB,
          payload: categoriesToTransfer
        })
      }
    }
  }

  const transferBookmarksToDB = async () => {
    const bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))

    if (bookmarkCollection.categories || bookmarkCollection.categories.length > 0) {
      
      const categories = bookmarkCollection.categories

      const config  = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        const res = await axios.post('/api/bulkDb', categories, config)

        if (res.data) {
          bookmarkCollection['categories'] = []
          localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))

          dispatch({
            type: LOCAL_TO_DB,
            payload: res.data.categoriesToTransfer
          })
          const isAuthenticated = true
          const bookmarksToDatabase = true
          getBookmarks(isAuthenticated, bookmarksToDatabase)
        } else {
          console.log('Shame...'); 
        }
        loadUser()
      } catch (err) {
        console.log(err);    
      }
    }
  }

  const transferBookmarksToLocal = async (bookmarksToDatabase) => {
    const config  = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const toDb = {
      sendToDb: bookmarksToDatabase    
    }

    try {
      const res = await axios.post('/api/bulkLocal', toDb, config)

      if(res.data.transferToLocal){

        let bookmarkCollection = JSON.parse(localStorage.getItem('bookmarkCollection'))
        const categoriesToLocal = res.data.categoriesToLocal

        if (bookmarkCollection) {
            if (bookmarkCollection.categories.length > 0) {
              const merge = bookmarkCollection.categories.concat(categoriesToLocal)
              bookmarkCollection['categories'] = merge
              localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
              //window.location = '/'
            } else {
              bookmarkCollection['categories'] = categoriesToLocal
              localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
              //window.location = '/'
            }
        } else {
          bookmarkCollection = {
            localCollectionId: uuid(),
            categories: categoriesToLocal
          }
          localStorage.setItem('bookmarkCollection', JSON.stringify(bookmarkCollection))
          //window.location = ''
        }
      }

      loadUser()
    } catch (err) {
      console.log(err);
      
    }
    
  }

    return (
        <BookmarkContext.Provider value={{
          bookmarkCollection: state.bookmarkCollection,
          categories: state.categories,
          categoryIds: state.categoryIds,
          filteredCategories: state.filteredCategories,
          filteredBookmarks: state.filteredBookmarks,
          filteredURLs: state.filteredURLs,
          categoriesToTransfer: state.categoriesToTransfer,
          showCat: state.showCat,
          error: state.error,
          getBookmarks,
          addBookmark,
          deleteBookmark,
          editCategory,
          sortCategories,
          filterCategories,
          clearFilter,
          expandCategory,
          checkLocalBookmarks,
          transferBookmarksToDB,
          transferBookmarksToLocal,
        }}>
            {props.children}
        </BookmarkContext.Provider>
    )
}

export default BookmarkState
