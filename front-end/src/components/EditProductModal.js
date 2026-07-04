import React from 'react';
import EditProduct from './UpdateProduct'; // edit form

const EditProductModal = ({ isOpen, onClose, refreshProducts, product, setSuccessMessage }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <button onClick={onClose} style={closeButtonStyles}>X</button>

        <EditProduct
          product={product}
          onClose={onClose}
          refreshProducts={refreshProducts}
          setSuccessMessage={setSuccessMessage} 
        />
      </div>
    </div>
  );
};

// 🔁 SAME styles (reuse bhi kar sakti ho later)
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

export default EditProductModal;
