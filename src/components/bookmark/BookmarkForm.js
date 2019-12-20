import React, {useState, useContext } from 'react'
import BookmarkContext from '../../context/bookmark/bookmarkContext'
import { Container, Row, Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext'

const BookmarkForm = () => {

    const bookmarkContext = useContext(BookmarkContext)
    const authContext = useContext(AuthContext)

    const {addBookmark, categoryIds} = bookmarkContext
    const { bookmarksToDatabase } = authContext


    const [bookmark, setBookmark] = useState({
        url: '',
        name: '',
        category: 'choose',
        newCategory: ''
    })

    const {url, name, category, newCategory} = bookmark

    const onChange = e => {
        setBookmark({...bookmark, [e.target.name]: e.target.value})  
    }

    let disabled;
    (newCategory !== '' ? disabled = true : disabled = false)
    let required;
    (category === 'new' ? required = true : required = false)
    
    const onSubmit = e => {
        e.preventDefault()
        
        if(!validURL(url)){
          alert('Please enter a valid url')
        }else{
          if(category === 'choose'){
            alert('Please choose a category or create new')
          }else{
            addBookmark(bookmark, bookmarksToDatabase)
            setBookmark({
                url: '',
                name: '',
                category: 'choose',
                newCategory: ''
            })
          }   
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
        <Container>
            <Form onSubmit={onSubmit}>
            <InputGroup size="lg" className="mb-4 new-url">
            <FormControl
              placeholder="Put the site url here..."
              type="text"
              name="url"
              value={url}
              onChange={onChange}
              required
            />
          </InputGroup>
          {url !== '' || name !== '' || newCategory !== '' ? (
          <Row>
            <Col md={3}>
            <InputGroup className="mb-4">
            <FormControl
              placeholder="Site name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </InputGroup>
            </Col>
            <Col md={3}>
            <Form.Control name="category" value={category} className="mb-4" as="select" onChange={onChange} disabled={disabled} >
            <option value="choose">Choose...</option>
            <option value="new">New +</option>
            {categoryIds.length > 0 && 
            (categoryIds.map((listItem, i) => 
            (<option key={listItem.categoryId} value={listItem.categoryId} > {listItem.categoryName} </option>)))}
          </Form.Control>
            </Col>
            {category === 'new' ? (
            <Col md={3}>
            <InputGroup className="mb-4">
            <FormControl
              placeholder="New Category"
              type="text"
              name="newCategory"
              value={newCategory}
              onChange={onChange}
              required={required}
            />
          </InputGroup>
            </Col>
                      ) : <div></div>
                    }
             <Col md={(category === 'new' ? 3 : { span: 3, offset: 3 })}>          
            <Button type="submit" variant="success" className="btn-save-bookmark" >Save It!</Button>
            </Col> 
          </Row>) : (<div></div>)}       
        </Form>
        </Container>
    )
}

export default BookmarkForm
