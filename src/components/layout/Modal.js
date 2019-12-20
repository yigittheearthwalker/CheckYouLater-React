import React, {useContext} from 'react'
import { Button, Modal } from 'react-bootstrap';
import ModalContext from '../../context/modal/modalContext'
import LoginModal from './customModals/LoginModal'
import TransferModal from './customModals/TransferModal'
import EditModal from './customModals/EditModal'
import EditCategoryModal from './customModals/EditCategoryModal'
import SettingsModal from './customModals/SettingsModal'

const ModalLayout = (props) => {

    const modalContext = useContext(ModalContext)

    const {modal, modalShow, removeModal} = modalContext
    const {modalSize, modalTitle, modalBody, hasCustomBody, customBodyName, hasCustomModalFooter, objectToPass} = modal

    if(modalShow){
        return (
          <Modal
          {...props}
          size={modalSize}
          aria-labelledby="contained-modal-title-vcenter"
          onHide={removeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {modalTitle}
            </Modal.Title>
          </Modal.Header>
          
            {hasCustomBody ? 
            (customBodyName === 'login' ? (<LoginModal />) : 
            (customBodyName === 'bookmarkTransfer' ? (<TransferModal objectToPass={objectToPass}/>) : 
            (customBodyName === 'bookmarkEdit' ? (<EditModal objectToPass={objectToPass} />) : 
            (customBodyName === 'categoryEdit' ? (<EditCategoryModal objectToPass={objectToPass} />) : 
            (customBodyName === 'settings' ? (<SettingsModal />) : 
            ((((<h4>Centered Modal</h4>)))))))))    
             : (<p>
               <Modal.Body>
              {modalBody}
              </Modal.Body>
            </p>)}
            
          
          {!hasCustomModalFooter && (
            <Modal.Footer>
            <Button variant="danger" onClick={removeModal}>Close</Button>
            </Modal.Footer>
          )}
        </Modal>
        )
      } else {
        return false
      }
    
    }

export default ModalLayout

