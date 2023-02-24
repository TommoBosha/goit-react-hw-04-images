import React, { useEffect} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalWrapp, BtnClose } from './Modal.styled';
import { AiOutlineClose } from 'react-icons/ai';


const modalRoot = document.querySelector("#modal-root")

export default function Modal ({onClose, children}) {
  
    useEffect(() => {
        window.addEventListener('keydown', onCloseModal);
        return () => {
        window.removeEventListener('keydown', onCloseModal);
        };
         
    });


   const onCloseModal = (e) => {
        if (e.code === 'Escape') {
            onClose();
        }
    }

   const  onCloseModalOnBackdrop = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };
    
    
        return (
            createPortal(
                <Overlay onClick={onCloseModalOnBackdrop}>
                    <ModalWrapp>
                        {children}
                    </ModalWrapp>
                    <BtnClose type="button" onClick={onClose}><AiOutlineClose style={{ width: 30, height: 30, margin: 0 }} /></BtnClose>
                </Overlay>,
                modalRoot)
        )
}

Modal.propTypes = {
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
}
