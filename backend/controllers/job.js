import { JobModel } from '../models/JobSchema.js';

// Create a new job
export const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            salary,
            description,
            requirements,
            eligibility,
            linkedin,
            companyWebsite,
            type,
            campus
        } = req.body;

        // Validate required fields
        if (!title || !company) {
            return res.status(400).json({
                success: false,
                error: "Title and company are required"
            });
        }

        const jobData = {
            ...req.body,
            createdBy: req.user._id, // Track who created the job
        };

        const job = new JobModel(jobData);
        await job.save();

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Get all jobs with pagination and filtering
export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (req.query.type) {
            filter.type = req.query.type;
        }
        if (req.query.campus) {
            filter.campus = req.query.campus;
        }
        if (req.query.company) {
            filter.company = { $regex: req.query.company, $options: 'i' };
        }
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { company: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const jobs = await JobModel.find(filter)
            .populate('createdBy', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await JobModel.countDocuments(filter);

        res.json({
            success: true,
            data: jobs,
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

// Get a job by ID
export const getJobById = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id)
            .populate('createdBy', 'username firstName lastName');

        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Update a job by ID
export const updateJob = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'title',
        'company',
        'location',
        'salary',
        'description',
        'requirements',
        'eligibility',
        'linkedin',
        'companyWebsite',
        'type',
        'campus'
    ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({
            success: false,
            error: 'Invalid updates!'
        });
    }

    try {
        const job = await JobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        // Check if user owns the job or is admin
        if (job.createdBy && job.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: "You can only update jobs you created"
            });
        }

        const updatedJob = await JobModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedBy: req.user._id // Track who updated the job
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Delete a job by ID
export const deleteJob = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        // Check if user owns the job or is admin
        if (job.createdBy && job.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: "You can only delete jobs you created"
            });
        }

        await JobModel.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get jobs created by current user
export const getMyJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const jobs = await JobModel.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await JobModel.countDocuments({ createdBy: req.user._id });

        res.json({
            success: true,
            data: jobs,
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