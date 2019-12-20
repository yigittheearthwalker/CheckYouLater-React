import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap';

const IntroLayout = () => {
    return (
        <Fragment>
           
            <Col xs={12} className="hello-header text-center"><p style={{color: '#555'}} >Hey There!</p></Col>
            <Col xs={{span:10, offset:1}} className="hello-container">
                    <Row >
                  <Col xs={12} sm={6} md={4} lg={4} xl={4} className="hello-box">
                    <div className="hello-icon">
                    <i className="icon far fa-bookmark"></i>
                  </div>
                    <p>Meet <strong>CheckYouLater!</strong> A very simple app that makes saving your favorite websites possible. Start adding your bookmarks. You can either keep them locally in your browser or take them everywhere by creating an account easily</p></Col>
                      
                <Col xs={12} sm={6} md={4} lg={4} xl={4} className="hello-box">
                    <div className="hello-icon">
                  <i className="icon fab fa-chrome"></i></div>
                  <p>Our browser extention will make your life very easy. It lets you add new bookmarks and quick notes without even accessing to <strong>CheckYouLater</strong>.org </p></Col>
                <Col xs={{span:12, offset:0}} sm={{span:6, offset:3}} md={{span:4, offset:0}} lg={{span:4, offset:0}} xl={{span:4, offset:0}} className="hello-box">
                    <div className="hello-icon">
                    <i className="icon fas fa-mobile-alt"></i></div>
                  <p>You can access to your bookmarks from your mobile device. You can also check out your saved notes even when you are offline. </p></Col>
              </Row>
              </Col>
        </Fragment>
    )
}

export default IntroLayout
