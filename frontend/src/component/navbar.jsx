import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { uploadFile } from '../service/api';

const Navbar = () => {
  const navigate = useNavigate();

  // Generic function to handle navigation based on authentication
  const handleNavigation = async (route) => {
    try {
      const response = await uploadFile();
      if (response.success) {
        navigate(route);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error while checking authentication:', err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">AIinvoice</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavigation('/invoice')}>Invoice</span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavigation('/customer')}>Customer</span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavigation('/product')}>Product</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
