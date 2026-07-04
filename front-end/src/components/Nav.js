import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav=()=>{

    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const logout = () => {
       localStorage.clear();
       navigate('/signup');
    }
    return (
        <div> 
            {/* <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaL01Ha-DhuydblrFn-KYmmvmx5ACGVujq2A&s" 
            alt="Logo" style={{ width: '64px', height: 'auto', position: 'absolute' }} /> */}

            { auth ? 
            <ul className="nav-ul">
                <li><Link to="/">Products</Link></li>
                {/* <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li> */}
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/signup" onClick={logout}>Logout <b>({JSON.parse(auth).name})</b></Link></li>
             </ul>
              : 
              <ul className="nav-ul signlog">
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            } 
        </div>
    )
}

export default Nav;