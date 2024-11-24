import express from 'express';
import { uploadFile } from '../controller/file-controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/upload', upload.single('file') , uploadFile);
//router.get('/file/:fieldId', getImage);


export default router;