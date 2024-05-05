
import { ClubModel } from '../models/ClubModel.js';
import fs from 'fs';

export const createClub = async (req, res) => {
    try {
        const { title, summary, content } = req.body;

        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);

        const club = new Club({ title, summary, content, cover: newPath });
        await club.save();

        res.json({
            success: true,
            message: 'Club created successfully',
            club: {
                _id: club._id,
                title: club.title,
                summary: club.summary,
                content: club.content,
                cover: newPath,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
