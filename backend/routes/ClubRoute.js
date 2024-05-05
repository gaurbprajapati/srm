
import { createClub } from '../controllers/club.js';
import express from "express";
import multer from 'multer';
const uploadMiddleware = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/create-club", uploadMiddleware.single("file"), createClub);





export default router;