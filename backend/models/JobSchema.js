import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    salary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    requirements: {
        type: Array,
        default: []
    },
    eligibility: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    companyWebsite: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
        default: 'full-time'
    },
    campus: {
        type: String,
        enum: ['on-campus', 'off-campus'],
        default: 'off-campus'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ type: 1 });
jobSchema.index({ campus: 1 });
jobSchema.index({ createdBy: 1 });
jobSchema.index({ createdAt: -1 });

export const JobModel = mongoose.model('JobModel', jobSchema);
// Path: backend/models/ClubModel.js 