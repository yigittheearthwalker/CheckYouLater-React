import React, { useContext, useState, useEffect } from 'react'
import { Modal, Form, Button, FormControl, Row, Col, InputGroup } from 'react-bootstrap';
import BookmarkContext from '../../../context/bookmark/bookmarkContext'
import ModalContext from '../../../context/modal/modalContext'

const EditModal = (props) => {

    const bookmarkContext = useContext(BookmarkContext)
    const modalContext = useContext(ModalContext)
    const { categoryIds, addBookmark, deleteBookmark } = bookmarkContext
    const { objectToPass } = props

    useEffect(() => {
        setEdit({
            name: objectToPass.bookmark.name,
            url: objectToPass.bookmark.url,
            category: objectToPass.originCategory
        })
            //eslint-disable-next-line
    }, [])

    const [edit, setEdit] = useState({
        name: '',
        url: '',
        category: '',
    })

    const { name, url, category } = edit

    const onChange = e => setEdit({...edit, [e.target.name]: e.target.value});

    const onSubmit = e => {
        e.preventDefault()
        if(!validURL(url)){
          alert('Please enter a valid url')
        }else{
        let bookmark = objectToPass.bookmark
        const bookmarksToDatabase = objectToPass.bookmarksToDatabase

        let bookmarkToDelete = {
            bookmarkId: (bookmark._id ? bookmark._id : bookmark.localBookmarkId),
            categoryId: objectToPass.originCategory,
            bookmarksToDatabase: bookmarksToDatabase
        }
        addBookmark(edit, bookmarksToDatabase)
        deleteBookmark(bookmarkToDelete)
        
        modalContext.removeModal()
      }
    }

    const validURL = (url) => {
      var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
      var pattern = new RegExp(expression); // fragment locator
        if (!url.match(pattern)) {
          console.log('Use a valid URL!');      
            return false;
        }else{
          return true;
        }
        
    }

    return (
        <Form onSubmit={onSubmit}>
        <Modal.Body>
        <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <InputGroup size="lg" className="mb-4">
            <FormControl
              placeholder="Put the site url here..."
              type="text"
              name="url"
              value={url}
              onChange={onChange}
            />
          </InputGroup>
            </Col>
        </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <InputGroup className="mb-4">
            <FormControl
              placeholder="Site name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
            />
          </InputGroup>
            </Col>
        </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <Form.Control name="category" value={category} className="mb-4" as="select" onChange={onChange} >
            {categoryIds.length > 0 && 
            (categoryIds.map((listItem, i) => 
            (<option key={listItem.categoryId} value={listItem.categoryId} > {listItem.categoryName} </option>)))}
          </Form.Control>
            </Col>
        </Row>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={modalContext.removeModal}>Close</Button>
        <Button type="submit" variant="success" >Edit</Button>
        </Modal.Footer>
        </Form>
    )
}

export default EditModal
