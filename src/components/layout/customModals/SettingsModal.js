import React, { useContext, useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import BookmarkContext from '../../../context/bookmark/bookmarkContext'
import ModalContext from '../../../context/modal/modalContext'
import AuthContext from '../../../context/auth/authContext'

const SettingsModal = () => {

    const bookmarkContext = useContext(BookmarkContext)
    const modalContext = useContext(ModalContext)
    const authContext = useContext(AuthContext)
    const { bookmarksToDatabase } = authContext
    const { transferBookmarksToDB, transferBookmarksToLocal } = bookmarkContext

    useEffect(() => {
        setSettings({
            localOrDB: (bookmarksToDatabase ? 'db' : 'local')
        })
            //eslint-disable-next-line
    }, [bookmarksToDatabase])

    const [settings, setSettings] = useState({
        localOrDB: ''
    })

    const {localOrDB} = settings



    const onChange = (e)=> {
        setSettings({...settings, [e.target.name]: e.target.value})
                
    }
    

    const onSubmit = (e) => {
        e.preventDefault()
        if(bookmarksToDatabase && localOrDB === 'local') {
            transferBookmarksToLocal(bookmarksToDatabase)
        }else if (!bookmarksToDatabase && localOrDB === 'db'){
            transferBookmarksToDB()
        }
        modalContext.removeModal()  
    }

    return (
        <Form onSubmit={onSubmit}>
        <Modal.Body>
        <ul>
            <li>
                <Row>
                    <Col sm={12} md={6}>
            <p className="settings-label">Bookmarks should be saved to </p>
                    </Col>
                    <Col sm={12} md={6}>
            <Form.Control size="sm" name="localOrDB" value={localOrDB} className="mb-4 settings-input" as="select" onChange={onChange} >
            <option value="db" > CYL Database </option>
            <option value="local"> Your Browser </option>
            </Form.Control>
            </Col>
            </Row>
            </li>
        </ul>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={modalContext.removeModal}>Close</Button>
        <Button type="submit" variant="success" >Save It</Button>
        </Modal.Footer>
        </Form>
    )
}

export default SettingsModal
