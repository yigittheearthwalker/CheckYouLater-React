import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { Modal } from 'react-bootstrap';
import AuthContext from '../../../context/auth/authContext'
import ModalContext from '../../../context/modal/modalContext'

const LoginModal = () => {

    const authContext = useContext(AuthContext)
    const modalContext = useContext(ModalContext)

    const {authStart} = authContext

    const googleLogin = () => {
        const provider = 'google'
        authStart(provider)
        modalContext.removeModal()
    }
    const facebookLogin = () => {
        const provider = 'facebook'
        authStart(provider)
        modalContext.removeModal()
    }

    return (
        <Modal.Body>
        <ul className="login-buttons">
            <li className="google-btn"><Link to="#" onClick={googleLogin}>Sign in with Google</Link></li>
            <li className="facebook-btn"><Link to="#" onClick={facebookLogin}>Sign in with Facebook</Link></li>
        </ul>
        </Modal.Body>
    )
}

export default LoginModal
