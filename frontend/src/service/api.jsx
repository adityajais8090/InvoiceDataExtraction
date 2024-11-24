import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const uploadFile = async (data) => {
    try{
         const response = await axios.post(`${API_URL}/upload`, data);
         console.log("Here is the response", response.data);
          return response.data;
    }catch(err){
        console.log("Error while uploading files",err);
    }
}