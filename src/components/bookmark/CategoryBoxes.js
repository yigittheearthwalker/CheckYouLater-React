import React, {Fragment, useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup } from 'react-bootstrap';
import CategoryBoxItem from './CategoryBoxItem'
import BookmarkContext from '../../context/bookmark/bookmarkContext'
import AuthContext from '../../context/auth/authContext'
import IntroLayout from './IntroLayout'

const CategoryBoxes = () => {

const bookmarkContext = useContext(BookmarkContext)
const authContext = useContext(AuthContext)

let {isAuthenticated, bookmarksToDatabase} = authContext
const {categories, filteredCategories, filteredBookmarks, filteredURLs, getBookmarks, sortCategories, showCat, categoriesToTransfer, transferBookmarksToDB} = bookmarkContext

const [categoryOrder, setCategoryOrder] = useState({
    categoryList: null,
    draggedItem: null,
    dragOverItem: null,
    currentCategory: null,
    showFilteredCategory: false,
})

const {categoryList, showFilteredCategory} = categoryOrder

useEffect(() => {
    
    if(categoriesToTransfer){
        if (bookmarksToDatabase) {
            transferBookmarksToDB()
            getBookmarks(isAuthenticated, bookmarksToDatabase)
            setCategoryOrder({
            ...categoryOrder, categoryList: categories
        })
        } else {
        getBookmarks(isAuthenticated, bookmarksToDatabase)
        setCategoryOrder({
            ...categoryOrder, categoryList: categories
        })
        }
    }else{
        getBookmarks(isAuthenticated, bookmarksToDatabase)
        setCategoryOrder({
            ...categoryOrder, categoryList: categories
        })
    }
    
    //eslint-disable-next-line
  }, [bookmarksToDatabase, categoriesToTransfer])
  useEffect(() => {
    setCategoryOrder({
        ...categoryOrder, categoryList: categories
    })
    //eslint-disable-next-line
  }, [categories])
  useEffect(() => {
    setCategoryOrder({
        ...categoryOrder, showFilteredCategory: false
    })
    //eslint-disable-next-line
  }, [filteredCategories])
  
  const onDragStart = (e, category) => {
    if (category._id) {
        const draggedItem = category._id
        setCategoryOrder({...categoryOrder, draggedItem: draggedItem})    
        
    } else {
        const draggedItem = category.localCategoryId
        setCategoryOrder({...categoryOrder, draggedItem: draggedItem})    
    }

  }

  const onDragOver = (category, i) => {
    if (category._id) {
        const dragOverItem = category._id
        if(dragOverItem !== categoryOrder.draggedItem){
            setCategoryOrder({...categoryOrder, dragOverItem: dragOverItem})
            let categoryList = categoryOrder.categoryList
            let draggedItem = categoryOrder.draggedItem
            
            categoryList.forEach((category, k) => {
                if (category._id === draggedItem) {
                    categoryList.splice(k, 1)
                    categoryList.splice(i, 0, category)
                    setCategoryOrder({...categoryOrder, categoryList: categoryList})
 
                }
            })
        }
    } else {
        const dragOverItem = category.localCategoryId        
        if(dragOverItem !== categoryOrder.draggedItem){
            setCategoryOrder({...categoryOrder, dragOverItem: dragOverItem})
            let categoryList = categoryOrder.categoryList
            let draggedItem = categoryOrder.draggedItem
            
            categoryList.forEach((category, k) => {
                if (category.localCategoryId === draggedItem) {
                    categoryList.splice(k, 1)
                    categoryList.splice(i, 0, category)
                    setCategoryOrder({...categoryOrder, categoryList: categoryList})
 
                }
            })
        }
    }   
  }
  const onDragEnd = (category, i) => {
const categoryList = categoryOrder.categoryList

sortCategories(categoryList, bookmarksToDatabase)
}
const renderCategory = (filteredCategory) => {
    setCategoryOrder({...categoryOrder, showFilteredCategory: filteredCategory})

}



    if(!categoryList || categoryList.length < 1){
    return(
        <Fragment>
                <Row className="catRow" >
                <IntroLayout />
                </Row>
        </Fragment>
    )
    }else{

    if (!filteredCategories || !filteredBookmarks || !filteredURLs) {
        return (
            <Fragment>
                <Row className="catRow">
                    {categoryList.map((category, i) => (
                <Col key={i} draggable 
                className={showCat === (category._id ? category._id : category.localCategoryId) ? "show-cat category-wrapper" : "category-wrapper"} 
                xs={6} sm={4} md={3} lg={3} xl={2}
                onDragStart={(e) => onDragStart(e, category)}
                onDragOver={() => onDragOver(category, i)}
                onDragEnd={() => onDragEnd(category, i)}
                >
                <CategoryBoxItem draggable 
                category={category} bookmarksToDatabase={bookmarksToDatabase}/>
                </Col>

                ))}
                </Row>
            </Fragment>
        )
    }    
    else {
        if(showFilteredCategory){
            return(
            <Fragment>
                <Row>
                    <Col xs={{ span: 12, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="filter-list-header"><h5>{showFilteredCategory.categoryName}</h5></ListGroup.Item>
                        <ListGroup.Item className="filter-list-header">{showFilteredCategory.categoryName} category's bookmarks are listed below</ListGroup.Item>
                        {showFilteredCategory.bookmarks.map((sfcBookmark, i) => 
                            <ListGroup.Item key={i} className="filter-list-item">
                            <a href={sfcBookmark.url} > {sfcBookmark.name} </a>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    </Col>
                </Row>
            </Fragment>
            )
        }else{
            return(
                <Fragment>
                    <Row>
                        <Col xs={{ span: 12, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }} >
                        <ListGroup variant="flush">
                        <ListGroup.Item className="filter-list-header"><h5>Categories</h5></ListGroup.Item>
                        {filteredCategories.length === 0 ? 
                        (<ListGroup.Item className="filter-list-item" >No Matches</ListGroup.Item>) : 
                        (filteredCategories.map((filteredCategory, i) => (
                        <ListGroup.Item key={i} className="filter-list-item">
                        <Link to='#' onClick={()=>renderCategory(filteredCategory)} >{filteredCategory.categoryName}</Link>
                        </ListGroup.Item>
                        )))}
                        <ListGroup.Item className="filter-list-header" ><h5>Bookmarks</h5></ListGroup.Item>
                        {filteredBookmarks.length === 0 ?
                        (<ListGroup.Item className="filter-list-item" >No Matches</ListGroup.Item>) : 
                        (filteredBookmarks.map((filteredBookmark, i) => (
                        <ListGroup.Item key={i} className="filter-list-item">
                        <a href={filteredBookmark.url}> {filteredBookmark.name} </a>
                        </ListGroup.Item>
                        )))}
                        <ListGroup.Item className="filter-list-header" ><h5>URLs</h5></ListGroup.Item>
                        {filteredURLs.length === 0 ? 
                        (<ListGroup.Item className="filter-list-item">No Matches</ListGroup.Item>) : 
                        (filteredURLs.map((filteredURL, i) => (
                        <ListGroup.Item key={i} className="filter-list-item">
                        <a href={filteredURL.url}>{filteredURL.url}</a>
                        </ListGroup.Item>
                        )))}
                    </ListGroup>
                        </Col>
                    </Row>        
                </Fragment>
            )
        }
        
    }

    }

}

export default CategoryBoxes

//(bookmarksToDatabase ? category.categoryId : category.localCategoryId)