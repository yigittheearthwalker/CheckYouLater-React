import React, { useContext, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import BookmarkContext from '../../../context/bookmark/bookmarkContext'
import ModalContext from '../../../context/modal/modalContext'

const TransferModal = (props) => {

    const bookmarkContext = useContext(BookmarkContext)
    const modalContext = useContext(ModalContext)
    const { categoryIds, addBookmark, deleteBookmark } = bookmarkContext
    //const { removeModal } = modalContext
    const { objectToPass } = props

    const [transfer, setTransfer] = useState({
        sendTo: ''
    })

    const { sendTo } = transfer

    const onChange = e => setTransfer({...transfer, [e.target.name]: e.target.value});

    const onSubmit = e => {
        e.preventDefault()
        let bookmark = objectToPass.bookmark
            bookmark['category'] = sendTo
        const bookmarksToDatabase = (objectToPass.bookmarksToDatabase)
        let bookmarkToDelete = {
            bookmarkId: (bookmark._id ? bookmark._id : bookmark.localBookmarkId),
            categoryId: objectToPass.originCategory,
            bookmarksToDatabase: bookmarksToDatabase
        }
        addBookmark(bookmark, bookmarksToDatabase)
        deleteBookmark(bookmarkToDelete)
        setTransfer({
            sendTo: ''
        })
        modalContext.removeModal()
    }

    return (
        <Form onSubmit={onSubmit}>
        <Modal.Body>
        <ul>
            {categoryIds.map(category => 
                (category.categoryId !== objectToPass.originCategory &&
                (<li key={category.categoryId} >
                <Form.Check 
                    type='radio'
                    id='default-radio'
                    name='sendTo'
                    value={category.categoryId}
                    onChange={onChange}
                    label={category.categoryName}
                    checked={sendTo === category.categoryId}
                />
                </li>)
                ))}
        </ul>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={modalContext.removeModal}>Close</Button>
        <Button type="submit" variant="success" >Move It</Button>
        </Modal.Footer>
        </Form>
    )
}

export default TransferModal
