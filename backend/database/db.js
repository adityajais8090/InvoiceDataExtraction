import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DBconnection = async () =>{
   const MONGODB_URI = process.env.MONGODB_URL;
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("DB connection established !");

    }catch(err){
        console.log("error connecting to MONGODB", err);
    }
}

export default DBconnection;
