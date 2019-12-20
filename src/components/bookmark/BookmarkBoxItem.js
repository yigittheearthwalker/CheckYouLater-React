import React, {useContext} from 'react'
import { Col, Dropdown, Table } from 'react-bootstrap';
import BookmarkContext from '../../context/bookmark/bookmarkContext'
import ModalContext from '../../context/modal/modalContext'


const BookmarkBoxItem = ({category, bookmark, bookmarksToDatabase}) => {

    const color = category.color+'A8'

    const bookmarkContext = useContext(BookmarkContext)
    const modalContext = useContext(ModalContext)

    const {deleteBookmark} = bookmarkContext
    const {setModal} = modalContext


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

    return (
        <Col className="site-wrapper" xs={6} sm={4} md={3} lg={3} xl={2}>
        <div className="catBox shadow-sm" style={{backgroundColor: color}} >
            <Table className="table table-borderless">
            <tbody>
                <tr>
                    <td>
                        <a target="_blank" rel="noopener noreferrer" href={`${bookmark.url}`}>
                        <img 
                        className="site-logo" 
                        src={`https://www.google.com/s2/favicons?domain_url=${bookmark.url}`} alt='#'/>
                        </a>
                    </td>
                    <td className="bookmark-name">
                        <a className="bookmark-anchor" target="_blank" rel="noopener noreferrer" href={`${bookmark.url}`}>{bookmark.name}</a>
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
                </tr>
            </tbody>
            </Table>
        </div>
        </Col>
    )
}

export default BookmarkBoxItem

/*<ul className="nav nav-pills nav-justified flex-column">
            <li className="nav-item">
            <Dropdown as={ButtonGroup}>
            <Button  variant="default" type="button">
                <a href={bookmark.url}>
                <img className="site-logo" src={`http://www.google.com/s2/favicons?domain_url=${bookmark.url}`} alt='#'/>
                </a>
                </Button>
            <Dropdown.Toggle variant="default" id="dropdown-basic" className="btn-group">
            
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item href="#" onClick={(e) => setToEdit(e, bookmark, category)} >Edit</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => deleteThis(e, bookmark, category)}>Delete</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => presentCategories(e, bookmark, category)} >Move</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown> 
            </li>
            <li className="nav-item">
            <h5 className="bookmark-header nav-link" ><a href={bookmark.url}>{bookmark.name}</a></h5>
            </li>
        </ul>*/
