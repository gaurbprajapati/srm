
import { ClubModel } from '../models/ClubModel.js';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../FrontEnd/src/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

export const upload = multer({ storage: storage });

// Create a new club
export const createClub = async (req, res) => {
    try {
        if (req.file === undefined) {
            return res.status(422).json({
                success: false,
                error: "No file uploaded"
            });
        }

        const imageName = req.file.filename;
        const {
            title,
            category,
            discription,
            observation,
            achievement,
            president,
            vicePresident,
            memberName,
            facultyName,
            announcment,
            whatup,
            instagram,
            linkedin,
            discord
        } = req.body;

        // Validate required fields
        if (!title || !category || !discription) {
            return res.status(400).json({
                success: false,
                error: "Title, category, and description are required"
            });
        }

        const formattedAnnouncements = announcment ? announcment.map(item => ({
            announcmentName: item.announcmentName,
            announcmentdate: item.announcmentdate
        })) : [];

        const clubDoc = await ClubModel.create({
            title,
            category,
            discription,
            achievement,
            observation,
            president,
            vicePresident,
            memberName,
            facultyName,
            announcment: formattedAnnouncements,
            whatup,
            instagram,
            linkedin,
            discord,
            cover: imageName,
            createdBy: req.user._id, // Track who created the club
        });

        res.status(201).json({
            success: true,
            message: "Club created successfully",
            data: clubDoc
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Update an existing club
export const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            category,
            discription,
            observation,
            achievement,
            president,
            vicePresident,
            memberName,
            facultyName,
            announcment,
            whatup,
            instagram,
            linkedin,
            discord
        } = req.body;

        const clubDoc = await ClubModel.findById(id);

        if (!clubDoc) {
            return res.status(404).json({
                success: false,
                error: "Club not found"
            });
        }

        // Check if user owns the club or is admin
        if (clubDoc.createdBy && clubDoc.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: "You can only update clubs you created"
            });
        }

        let imageName = "";
        if (!req.file) {
            imageName = clubDoc.cover;
        } else {
            imageName = req.file.filename;
        }

        const updatedFields = {
            title,
            category,
            discription,
            achievement,
            observation,
            president,
            vicePresident,
            memberName,
            facultyName,
            whatup,
            instagram,
            linkedin,
            discord,
            cover: imageName,
            updatedBy: req.user._id, // Track who updated the club
        };

        if (announcment && announcment.length > 0) {
            updatedFields.announcment = clubDoc.announcment.concat(announcment.map(item => ({
                announcmentName: item.announcmentName,
                announcmentdate: new Date(item.announcmentdate)
            })));
        }

        const updatedClubDoc = await ClubModel.findByIdAndUpdate(id, updatedFields, { new: true });

        res.json({
            success: true,
            message: "Club updated successfully",
            data: updatedClubDoc
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get a single club by ID
export const getClubById = async (req, res) => {
    try {
        const { id } = req.params;
        const clubDoc = await ClubModel.findById(id).populate('createdBy', 'username firstName lastName');

        if (!clubDoc) {
            return res.status(404).json({
                success: false,
                error: "Club not found"
            });
        }

        res.json({
            success: true,
            data: clubDoc
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get all clubs with pagination and filtering
export const getAllClubs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { discription: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const clubs = await ClubModel.find(filter)
            .populate('createdBy', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ClubModel.countDocuments(filter);

        res.json({
            success: true,
            data: clubs,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Delete a club
export const deleteClub = async (req, res) => {
    try {
        const { id } = req.params;
        const clubDoc = await ClubModel.findById(id);

        if (!clubDoc) {
            return res.status(404).json({
                success: false,
                error: "Club not found"
            });
        }

        // Check if user owns the club or is admin
        if (clubDoc.createdBy && clubDoc.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: "You can only delete clubs you created"
            });
        }

        await ClubModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Club deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
