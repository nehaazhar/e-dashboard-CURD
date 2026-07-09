import React from "react";
import { API_BASE_URL } from "../config";

const AddProduct = ({ onClose, refreshProducts, setSuccessMessage }) => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [error, setError] = React.useState(false);

  const addProduct = async () => {
    if (!name || !price || !category || !company) {
      setError(true);
      return false;
    }

    console.warn(name, price, category, company);
    const userid = JSON.parse(localStorage.getItem("user"))._id;
    console.warn(userid);
    let result = await fetch(`${API_BASE_URL}/add-product`, {
      method: "post",
      body: JSON.stringify({ name, price, category, company, userid }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    result = await result.json();

    if (result && result._id) {
      if (typeof refreshProducts === "function") {
        refreshProducts();
      }

      if (typeof setSuccessMessage === "function") {
        setSuccessMessage("Product added successfully!");
      }

      if (typeof onClose === "function") {
        onClose();
      }

      // Clear form
      setName("");
      setPrice("");
      setCategory("");
      setCompany("");
      setError(false);
    }

    console.warn(result);
  };

  return (
    <div className="product-form">
      <h1>Add Product</h1>

      <div className="parent-div">
        {error && !name && <span>Enter valid name</span>}
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="parent-div">
        {error && !price && <span>Enter valid price</span>}
        <input
          type="text"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="parent-div">
        {error && !category && <span>Enter valid category</span>}
        <input
          type="text"
          placeholder="Enter product category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="parent-div">
        {error && !company && <span>Enter valid company</span>}
        <input
          type="text"
          placeholder="Enter product company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

export default AddProduct;
