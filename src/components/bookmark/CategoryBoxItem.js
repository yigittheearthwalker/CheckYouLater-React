import React, {useContext} from 'react'
import { Button, Jumbotron, Table, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import BookmarkContext from '../../context/bookmark/bookmarkContext';
import ModalContext from '../../context/modal/modalContext';



const CategoryBoxItem = ({category, bookmarksToDatabase}) => {

const bookmarkContext = useContext(BookmarkContext)
const modalContext = useContext(ModalContext)
const { deleteBookmark, expandCategory, showCat } = bookmarkContext
const { setModal } = modalContext

const {bookmarks} = category
  let color = category.color+'A8'

 const categoryEdit = (category) => {
     const categoryToEdit = {
         category: category,
         bookmarksToDatabase: bookmarksToDatabase
     }
    const modal = {
        modalSize: 'lg',
        modalTitle: 'Edit Category',
        hasCustomBody: true,
        customBodyName: 'categoryEdit',
        hasCustomModalFooter: true,
        onModalSubmit: '',
        objectToPass: categoryToEdit
    }
     setModal(modal)
 }  

 const presentCategories = (e, bookmark, category) => {
    e.preventDefault()
    const bookmarkToMove = {
        bookmark: bookmark,
        originCategory: (category._id ? category._id : category.localCategoryId),
        bookmarksToDatabase: bookmarksToDatabase
    }
    const modal = {
        modalSize: 'sm',
        modalTitle: 'Select Category',
        hasCustomBody: true,
        customBodyName: 'bookmarkTransfer',
        hasCustomModalFooter: true,
        onModalSubmit: '',
        objectToPass: bookmarkToMove
    }
    setModal(modal)
 }
 const setToEdit = (e, bookmark, category) => {
    e.preventDefault()
    const bookmarkToEdit = {
        bookmark: bookmark,
        originCategory: (category._id ? category._id : category.localCategoryId),
        bookmarksToDatabase: bookmarksToDatabase
    }
    const modal = {
        modalSize: 'lg',
        modalTitle: 'Edit Bookmark',
        hasCustomBody: true,
        customBodyName: 'bookmarkEdit',
        hasCustomModalFooter: true,
        onModalSubmit: '',
        objectToPass: bookmarkToEdit
    }
    setModal(modal)
}

 const deleteThis = (e, bookmark, category) => {
    e.preventDefault()
    let bookmarkToDelete = {bookmarkId: '', categoryId: '', bookmarksToDatabase: bookmarksToDatabase}
        bookmarkToDelete['bookmarkId'] = (bookmark._id ? bookmark._id : bookmark.localBookmarkId)
        bookmarkToDelete['categoryId'] = (category._id ? category._id : category.localCategoryId)

    deleteBookmark(bookmarkToDelete)
        
 }
 const toExpand = () => {
    
        const showCatId = (category._id ? category._id : category.localCategoryId)
        expandCategory(showCatId)

 }
 

    return (
        
            <Jumbotron 
            className={showCat === (category._id ? category._id : category.localCategoryId) ? "show-box box style-3" : "box style-3"}
             style={{backgroundColor: color}}>
                <Table className="table table-borderless">
                    <thead>
                        <tr>
                            <th colSpan="2" className="text-center">
                                <h5 className="catHeader">
                                    <Link className="category-page-link"
                                    to={category._id ? 
                                    (`/category/${category._id}`) : 
                                    (`/category/${category.localCategoryId}`)}>
                                    {category.categoryName}
                                    </Link> 
                                    <Link to="#" className="expand-link" onClick={toExpand} >{category.categoryName}</Link> 
                                </h5>
                            </th>
                            <th colSpan="1" className="btn-column">
                            <Button variant="default" size="sm" onClick={ () =>  categoryEdit(category)}><i className="far fa-edit" /></Button>
                            
                            </th>
                        </tr>
                    </thead>
                    <tbody
                    className={showCat === (category._id ? category._id : category.localCategoryId) ? "show-tbody category-tbody" : "category-tbody"}
                    >
                        {bookmarks.map((bookmark, i) => 
                            (<tr key={i}>                   
                                <td>
                                  <a target="_blank" rel="noopener noreferrer" href={`${bookmark.url}`}>
                                    <img 
                                    className="site-logo" 
                                    src={`https://www.google.com/s2/favicons?domain_url=${bookmark.url}`} alt='#'/>
                                  </a>
                                </td>
                                <td className="bookmark-name">
                                    <a target="_blank" rel="noopener noreferrer" href={`${bookmark.url}`}>{bookmark.name}</a>
                                </td>
                                <td className="btn-column">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="default" id="dropdown-basic">

                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#" onClick={(e) => setToEdit(e, bookmark, category)} >Edit</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(e) => deleteThis(e, bookmark, category)}>Delete</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(e) => presentCategories(e, bookmark, category)} >Move</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </td>
                            </tr>))}
                    </tbody>
                </Table>                    
            </Jumbotron>
     
        
    )
}

export default CategoryBoxItem
