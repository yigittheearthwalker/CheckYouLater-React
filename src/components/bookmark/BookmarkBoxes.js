import React, {Fragment, useContext, useState} from 'react'
import { Container, Row, Form } from 'react-bootstrap';
import BookmarkBoxItem from './BookmarkBoxItem'
import AuthContext from '../../context/auth/authContext'

const BookmarkBoxes = (props) => {

    const authContext = useContext(AuthContext)   

    let {bookmarksToDatabase} = authContext
    const {category, categoryIds} = props

    const [pageCategory, setCurrent] = useState({
      currentCategory: (category._id ? category._id : category.localCategoryId),
      redirectCategory: (category._id ? category._id : category.localCategoryId)
    })
    const {currentCategory, redirectCategory} = pageCategory

    const onChange= (e) => {
       setCurrent({...pageCategory, [e.target.name]: e.target.value})

      if(currentCategory !== e.target.value) {
        console.log(e.target.value);
        window.location = ('/category/'+e.target.value)

      }
    }


    return (
        <Fragment >
            <Container>
          <Form className="new-url">
          <Form.Control size="sm" name="redirectCategory" 
          value={redirectCategory} 
          className="mb-4" 
          as="select" 
          onChange={onChange} >
            {categoryIds.length > 0 && 
            (categoryIds.map((listItem, i) => 
            (<option key={listItem.categoryId} value={listItem.categoryId} > {listItem.categoryName} </option>)))}
          </Form.Control>
          </Form>
        </Container>
        <Row className="catRow">
            {category.bookmarks.map((bookmark, i) => 
            <BookmarkBoxItem key={i} 
            bookmark={bookmark} 
            category={category} 
            bookmarksToDatabase={bookmarksToDatabase}/> 
            )}
        </Row>
        </Fragment>
    )
}

export default BookmarkBoxes
