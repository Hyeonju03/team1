// Modal.js
import React from 'react';
import './SignModal.css';

const SignModal = ({ isOpen, onClose, onConfirm, message, confirmText = "확인", cancelText = "취소" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onConfirm}>{confirmText}</button>
                <button onClick={onClose}>{cancelText}</button>
            </div>
        </div>
    );
};

export default SignModal;