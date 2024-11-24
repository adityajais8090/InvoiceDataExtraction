import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import fs from 'fs';
import xlsx from 'xlsx';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const jsonToCsv = (jsonData) => {
    const keys = Object.keys(jsonData[0]);
    const csvRows = [];
  
    // Add header row
    csvRows.push(keys.join(','));
  
    // Add data rows
    jsonData.forEach(row => {
      const values = keys.map(key => row[key]);
      csvRows.push(values.join(','));
    });
  
    return csvRows.join('\n');
  };
  
  const processExcelDataToCsv = (workbook) => {
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);
  
    // Convert JSON data to CSV format
    const csvContent = jsonToCsv(jsonData);
  
    // Define the path where the CSV file will be saved
    const csvFilePath = 'output.csv'; // You can modify this path as needed
  
    // Write the CSV data to the file
    fs.writeFileSync(csvFilePath, csvContent);
  
    // Return the path to the generated CSV file
    return csvFilePath;
  };
  
  
  

const getPromptForFileType = (fileType) => {
      return `Please extract and organize the data from the provided file into the following JSON format. Ensure the values are filled correctly for each field based on the data, and do not include any extra text or explanation. The structure should look like this:
        {
          "Customer Name": "<Customer Name>",
          "Products": [
            {
              "Product Name": "<ProductName1>",
              "Quantity": "<Quantity1>",
              "Unit Price": "<UnitPrice1>",
              "Discount": "<Discount1>",
              "Amount": "<Amount1>"
            },
            {
              "Product Name": "<ProductName2>",
              "Quantity": "<Quantity2>",
              "Unit Price": "<UnitPrice2>",
              "Discount": "<Discount2>",
              "Amount": "<Amount2>"
            }
            // Add more products as needed
          ],
          "Tax": "<Tax>",
          "Total Amount": "<Total Amount>",
          "Date": "<Date>",
          "Invoice Number": "<Invoice Number>",
          "GSTIN": "<GSTIN>",
          "Mobile Number": "<Mobile Number>"
        }`;
};

export const uploadFile = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    const localFilePath = req.file.path;
    const mimeType = req.file.mimetype;

    let prompt = '';
    let uploadResponse;

    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        try {
          // Process Excel file locally
          const workbook = xlsx.readFile(localFilePath);
          

          const uploadCsvFile = async (filePath) => {
            const uploadResponse = await fileManager.uploadFile(filePath, {
              mimeType: 'text/csv',  // Correct MIME type for CSV
              displayName: "CSV File",
            });
          
            // Check for successful upload
            if (uploadResponse && uploadResponse.file && uploadResponse.file.uri) {
              console.log('File uploaded successfully:', uploadResponse.file.uri);
              return uploadResponse.file.uri;
            } else {
              throw new Error('File upload failed');
            }
          };
          
          // Call the functions
          const csvFilePath = processExcelDataToCsv(workbook);
          uploadCsvFile(csvFilePath);
          
      
           // Directly use the data, no need to stringify here for prompt
          prompt = getPromptForFileType(mimeType);
      
          // Generate content with prompt for Excel file
          const result = await model.generateContent([{
            fileData: {
              mimeType: 'text/csv',
              fileUri: uploadResponse.file.uri, // Ensure this is not undefined
            },
          }, { text: prompt }]);
      
          console.log("Generated content:", result.response.text());
      
          try {
            // Clean the response by removing Markdown formatting (triple backticks)
            const cleanedResponse = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
            // Attempt to parse the cleaned response as JSON
            const jsonResponse = JSON.parse(cleanedResponse);
            // If parsing is successful, send back the JSON
            res.json({ extractedData: jsonResponse });
          } catch (error) {
            console.error("Error parsing JSON:", error);
            res.status(500).json({ error: "The content returned is not valid JSON." });
          }
      
        } catch (error) {
          console.error("Upload Failed with error:", error);
          res.status(500).json({ error: "File upload or processing failed" });
        }
      
        // Delete file if not yet deleted
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
      }
       else {
      // Upload file and set prompt for other types
      uploadResponse = await fileManager.uploadFile(localFilePath, {
        mimeType: mimeType,
        displayName: "Uploaded File",
      });
      prompt = getPromptForFileType(mimeType);
      console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
    }

    // Generate content with prompt for other file types
    if (uploadResponse) {
      const result = await model.generateContent([{
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      }, { text: prompt }]);

      console.log("Generated content:", result.response.text());

      try {
        // Clean the response by removing Markdown formatting (triple backticks)
        const cleanedResponse = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        // Attempt to parse the cleaned response as JSON
        const jsonResponse = JSON.parse(cleanedResponse);
        // If parsing is successful, send back the JSON
        res.json({ extractedData: jsonResponse });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.status(500).json({ error: "The content returned is not valid JSON." });
      }
    }

    // Delete file if not yet deleted
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  } catch (err) {
    console.error("Upload Failed with error:", err);
    res.status(500).json({ error: "File upload or processing failed" });
  }
};
