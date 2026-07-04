import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete this product <b>{productName}</b> ?</p>

        <div style={btnGroup}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
};

const modal = {
  background: '#fff',
  padding: '25px',
  borderRadius: '10px',
  width: '350px',
  textAlign: 'center',
};

const btnGroup = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
  gap: '20px',
};

const cancelBtn = {
  padding: '8px 16px',
  background: '#ccc',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const deleteBtn = {
  padding: '8px 16px',
  background: '#e63946',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default DeleteConfirmModal;
