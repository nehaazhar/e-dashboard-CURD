import React, { useEffect } from 'react';

const EditProduct = ({ product, onClose, refreshProducts, setSuccessMessage }) => {

    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [error, setError] = React.useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setCategory(product.category);
            setCompany(product.company);
        }
    }, [product]);

    const editProduct = async () => {
        if (!name || !price || !category || !company) {
            setError(true);
            return;
        }

        try {
            let response = await fetch(
                `http://localhost:5100/product/${product._id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ name, price, category, company }),
                    headers: {
                        'Content-Type': "application/json",
                        authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            await response.json();

            refreshProducts(); 

            if (typeof setSuccessMessage === 'function') {
                setSuccessMessage(`"${name}" updated successfully`);
                setTimeout(() => setSuccessMessage(''), 3000); // Clear after 3s
             }

            onClose();   

        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="product-form">
            <h3>Edit Product</h3>

            <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter product company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            {error && <p style={{ color: 'red' }}>All fields are required</p>}

            <button onClick={editProduct}>Update Product</button>
        </div>
    );
};

export default EditProduct;
