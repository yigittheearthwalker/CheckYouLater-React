import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
  
            <footer className="footer">
             <Row>
            <Col xs={12} sm={6}>
                <Row>
                <Col xs={{span:6, offset:0}} md={{span:5, offset:1}}  className="footer-logo">
                <img src="https://i.ibb.co/zh8nkT9/emptylogo.png" alt="" />
                </Col>
                
                <Col xs={6} className="footer-links" ><h5>Links</h5>
                    <ul className="list-unstyled text-small">
                    <li><Link to="#">ChromeExtension</Link></li>
                    <li><Link to="#">Android</Link></li>
                    <li><Link to="#">IOS</Link></li>
                    <li><Link to="#">WellDoneWorks</Link></li>
                    </ul>
                </Col>
                 </Row>
                </Col>
                <Col xs={6} sm={6} className="footer-text">
                    <p className="text-center"><strong>CheckYouLater</strong> is a <a href="http://welldoneworks.com">WellDoneWorks</a> project and it's absolutely free.</p>
                    <p className="text-center">2019</p>        
                </Col>
                </Row>   
                </footer>
    )
}

export default Footer
