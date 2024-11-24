import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { Customer, Home, Invoice, Product } from './pages';
import Navbar from './component/navbar';

function App() {
  return (
    <Router>
      {/* Navbar will appear on all pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
