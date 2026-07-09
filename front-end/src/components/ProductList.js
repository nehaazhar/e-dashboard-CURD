import react, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DataTable from "react-data-table-component";
import { API_BASE_URL } from "../config";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      navigate("/signup");
    } else {
      getProducts();
    }
  }, []);

  useEffect(() => {
    console.log("products =", products);
  }, [products]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    getProducts();
  }, [debouncedSearch, selectedCategory, selectedCompany, selectedUser]);

  // 1. Fixed: Double quotes ko hata kar backticks lagaye hain
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // 2. Fixed: Double quotes ko hata kar backticks lagaye hain
  useEffect(() => {
    fetch(`${API_BASE_URL}/companies`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  // 3. Fixed: Double quotes ko hata kar backticks lagaye hain
  useEffect(() => {
    fetch(`${API_BASE_URL}/users`, {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const getProducts = async () => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }

    if (selectedCompany) {
      params.append("company", selectedCompany);
    }

    if (selectedUser) {
      params.append("user", selectedUser);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    const url = `${API_BASE_URL}/products?${params.toString()}`;

    console.log("Final URL:", url);

    let response = await fetch(url, {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    let result = await response.json();
    setProducts(result);
  };

  // Delete using Optimistic UI
  const deleteProduct = async () => {
    const previousProducts = [...products];

    const updatedProducts = products.filter(
      (product) => product._id !== deleteId,
    );

    setProducts(updatedProducts);
    setShowDeleteModal(false);
    setSuccessMessage("Product deleted successfully!");

    try {
      let response = await fetch(`${API_BASE_URL}/product/${deleteId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      setProducts(previousProducts);
      alert("Delete failed, restored product.");
    }
  };

  const searchProducts = async (key) => {
    try {
      let response = await fetch(`${API_BASE_URL}/search/${key}`, {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      let result = await response.json();

      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    }
  };

  const clearInput = () => {
    setSearchText("");
    setDebouncedSearch("");
    getProducts();
  };

  const columns = [
    {
      name: "S. No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.userid?.name || "N/A",
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <i
            className="fa fa-pencil"
            style={{ color: "#2e94b9", cursor: "pointer", marginRight: "10px" }}
            onClick={() => {
              setSelectedProduct(row);
              setIsEditModalOpen(true);
            }}
          />
          <i
            className="fa fa-trash-o"
            style={{ color: "#e63946", cursor: "pointer" }}
            onClick={() => {
              setDeleteId(row._id);
              setDeleteProductName(row.name);
              setShowDeleteModal(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="product-list">
      <h3>Product List</h3>

      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search product..."
            className="search-box"
            id="searchInput"
          />
          <span className="clear-icon" onClick={clearInput}>
            &times;
          </span>
        </div>

        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="filter-select"
          >
            <option value="">All Companies</option>

            {companies.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="filter-select"
          >
            <option value="">All Users</option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="add-product-container">
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-product-button"
          >
            + Add Product
          </button>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshProducts={getProducts}
        setSuccessMessage={setSuccessMessage}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        refreshProducts={getProducts}
        setSuccessMessage={setSuccessMessage}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteProduct}
        setSuccessMessage={setSuccessMessage}
        productName={deleteProductName}
      />

      {successMessage && <div className="toast-success">{successMessage}</div>}

      <DataTable
        columns={columns}
        data={products}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
};

export default ProductList;
