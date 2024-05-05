import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: String,
    salary: String,
    description: String,
    postedDate: {
        type: Date,
        default: Date.now
    },
    requirements: { type: Array, default: [] },
    eligibility: String,
    linkedin: String,
    companyWebsite: String,
    type: String,
    campus: String,
});

export const JobModel = mongoose.model('JobModel', jobSchema);
// Path: backend/models/ClubModel.js 