import React, { useState, useEffect, useRef } from 'react';
import '../styles/home.css';
import { uploadFile } from '../service/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [file, setFile] = useState(null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [result, setResult] = useState(null); // Store the response data
    const fileInputRef = useRef();

    // Function to handle file upload
    const handleFileUpload = async () => {
        if (!file) return; // Ensure file exists before upload
        try {
            const data = new FormData();
            data.append('name', file.name);
            data.append('file', file);

            const response = await uploadFile(data);
            console.log("File uploaded successfully:", response);
            setResult(response.extractedData); // Save the result data
            setUploadComplete(true); // Mark upload as complete
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // UseEffect to upload file when it's selected
    useEffect(() => {
        if (file) {
            handleFileUpload();
        }
    }, [file]);

    // Function to trigger file input click
    const onUploadClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
      if (result) {
          console.log("Result data:", result); // Log result to see if it's populated
      }
  }, [result]);
  

    return (
        <div className="bg-img">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-5">
                        <div className="center-box bg-light">
                            <div className="text-center">
                                <h2><b>Algou File Sharing App!</b></h2>
                                <p>Upload and Share the download Link!</p>
                            </div>
                            <form>
                                <div className="mb-3 mt-5">
                                    <div className="d-flex justify-content-center mt-4">
                                        <button type="button" className="btn btn-secondary btn-lg" onClick={onUploadClick}>
                                            Upload
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Conditionally render the product table once upload is complete */}
                            {uploadComplete && result && (
                                <div className="mt-5">
                                    <h3>Product List</h3>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Unit Price</th>
                                                <th>Discount</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.Products && result.Products.map((product, index) => (
                                                <tr key={index}>
                                                    <td>{product["Product Name"]}</td>
                                                    <td>{product.Quantity}</td>
                                                    <td>{product["Unit Price"]}</td>
                                                    <td>{product.Discount}</td>
                                                    <td>{product.Amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div>
                                        <p><b>Tax:</b> {result.Tax}</p>
                                        <p><b>Total Amount:</b> {result["Total Amount"]}</p>
                                        <p><b>Invoice Number:</b> {result["Invoice Number"]}</p>
                                        <p><b>Date:</b> {result.Date}</p>
                                        <p><b>GSTIN:</b> {result.GSTIN}</p>
                                        <p><b>Customer Name:</b> {result["Customer Name"]}</p>
                                        <p><b>Mobile Number:</b> {result["Mobile Number"]}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
