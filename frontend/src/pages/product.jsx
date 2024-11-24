import React, { useState, useEffect, useRef } from 'react';
import '../styles/product.css';
import { uploadFile } from '../service/api';
import 'bootstrap/dist/css/bootstrap.min.css';



const Product = () => {
  
    const response = uploadFile();
    if(response){

    }
  
    
    return (
      <div className="bg-img">
       
        </div>
    ) 
};

export default Product;
