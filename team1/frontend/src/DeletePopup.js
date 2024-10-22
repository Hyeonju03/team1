import React from 'react';

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 shadow-lg" style={{width:"500px"}}>
                <p>휴지통의 모든 메일을 삭제하시겠습니까?</p>
                <p>삭제한 메일은 영구 삭제되어 복구할 수 없습니다.</p>
                <div className="flex justify-center mt-4">
                    <button onClick={onClose} className="mr-2 px-4 py-2 border rounded">취소</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">비우기</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationPopup;
