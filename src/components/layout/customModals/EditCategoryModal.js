import React, { useContext, useState, useEffect } from 'react'
import { Modal, Form, Button, FormControl, Row, Col, InputGroup, Dropdown, ButtonGroup } from 'react-bootstrap';
import { ChromePicker } from 'react-color';
import BookmarkContext from '../../../context/bookmark/bookmarkContext'
import ModalContext from '../../../context/modal/modalContext'

const EditCategoryModal = (props) => {

    const bookmarkContext = useContext(BookmarkContext)
    const modalContext = useContext(ModalContext)
    const { categoryIds, editCategory } = bookmarkContext
    const { objectToPass } = props
    var colors = ["#FFF176", "#FFF9C4", "#e67e22", "#FFCC80", "#ec644b", "#ef9a9a", "#CE93D8", "#F3E5F5", "#26C6DA", "#4DB6AC", "#c5eff7", "#81C784", "#C8E6C9"] 
    
    const { category, bookmarksToDatabase } = objectToPass 
    
    useEffect(() => {
        setEdit({
            name: category.categoryName,
            customColor: '',
            color: category.color,
            merge: (category._id ? category._id : category.localCategoryId),
            disabled: false
        })
            //eslint-disable-next-line
    }, [])

    const [edit, setEdit] = useState({
        name: '',
        color: '',
        customColor: '',
        merge: '',
        disabled: false
    })


    const { name, color, customColor, merge, disabled } = edit

    const onChange = e => {   
        setEdit({...edit, [e.target.name]: e.target.value})        
    };

    const setColor = (listItem) => {
        setEdit({...edit, color: listItem})        
}
    const setCustomColor = (color) => {
        setEdit({...edit, customColor: color})
    }
    const pickerSetter = (color, event) => {
        setEdit({...edit, color: color.hex, customColor: color.hex}) 
    }

    const onSubmit = e => {
        e.preventDefault()
        const categoryId = (category._id ? category._id : category.localCategoryId)

        if(categoryId === edit.merge){
           const merge = false
           const categoryUpdate = {
            categoryId: categoryId,
            categoryName: edit.name,
            color: edit.color,
            merge: merge,
            
        }
        
        editCategory(categoryUpdate, bookmarksToDatabase)
        }else{
            const merge = edit.merge
            const categoryUpdate = {
                categoryId: categoryId,
                categoryName: edit.name,
                color: edit.color,
                merge: merge,
                bookmarksToDatabase: bookmarksToDatabase
            }
           
            editCategory(categoryUpdate, bookmarksToDatabase)
        }
        modalContext.removeModal()
    }    

    return (
        <Form onSubmit={onSubmit}>
        <Modal.Body>
        <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <InputGroup size="lg" className="mb-4" disabled={disabled}>
            <FormControl
              disabled={disabled}
              placeholder="Category Name"
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
            <Dropdown className="color-button mb-4" as={ButtonGroup} drop="left" >
            <Button size="lg" className="color-button" variant="default" type="button" disabled={disabled}>
            {color ? (<div className="color-box" style={{backgroundColor: color}}>{color}</div>) : 'Select Color'}
                </Button>
            <Dropdown.Toggle size="lg" variant="default" id="dropdown-basic" className="btn-group" disabled={disabled}>
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {(colors.map((listItem, i) => 
                <Dropdown.Item key={i} href="#/action-1">
                    <div className="color-box" onClick={() => setColor(listItem)} style={{backgroundColor: listItem}}></div>
                </Dropdown.Item>
            ))}
                <Dropdown.Item href="#/action-1">
                    <div onClick={() => setCustomColor(color)} >Custom Color</div>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown> 
            </Col>
        </Row>
        {customColor !== '' && (
        <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <ChromePicker 
            className="mb-4 color-picker"
            color={customColor}
            onChange={pickerSetter}
            />
            </Col>
        </Row> 
        )}     
        <Row>
            <Col md={{ span: 8, offset: 2 }} >
            <label htmlFor="merge">Merge With Another Category(!)</label>
            <Form.Control id="merge" name="merge" value={merge} className="mb-4" as="select" onChange={onChange} >
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

export default EditCategoryModal
