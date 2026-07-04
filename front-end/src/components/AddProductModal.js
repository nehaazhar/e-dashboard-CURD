import React from 'react';
import AddProduct from './AddProduct'; // Import the form

const AddProductModal = ({ isOpen, onClose, refreshProducts, setSuccessMessage }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <button onClick={onClose} style={closeButtonStyles}>X</button>
        <AddProduct onClose={onClose} refreshProducts={refreshProducts} setSuccessMessage={setSuccessMessage} />
      </div>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  background: '#fff',
  padding: '20px',
  borderRadius: '10px',
  minWidth: '400px',
  maxWidth: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
  position: 'relative',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: '#2e94b9',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
};

export default AddProductModal;
