import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ required : true })); 

app.use('/', router);

//DBconnection();

// for localhost:8000 it will take care but after / middileware is used
app.get('/' , (req,res)=>{
  res.send("hello World!");
});

app.listen(8000, ()=>{
 console.log("Server is running on port : 8000");
});



























//first proceed with basic things like 
// 1. database connection part
// 2. models part
// 3. mongoDB ATLAS
// 4. logic and routes