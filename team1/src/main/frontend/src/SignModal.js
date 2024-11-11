// Modal.js
import React from 'react';
import './SignModal.css';

const SignModal = ({ isOpen, onClose, onConfirm, message, confirmText = "확인", cancelText = "취소" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay m-4">
            <div className="modal-content">
                <p>{message}</p>
                <div className="mt-3">
                <button className="mr-1 w-12 h-8 rounded bg-red-700 hover:bg-red-800 text-white" onClick={onConfirm}>{confirmText}</button>
                <button className="ml-1 w-12 h-8 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default SignModal;