import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ClubSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        discription: {
            type: String,
            required: true
        },
        observation: String,
        achievement: { type: Array, default: [] },
        cover: String,
        category: {
            type: String,
            required: true
        },
        president: String,
        vicePresident: String,
        whatup: String,
        instagram: String,
        linkedin: String,
        discord: String,
        memberName: { type: Array, default: [] },
        facultyName: { type: Array, default: [] },
        announcment: { type: Array, default: [] },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

export const ClubModel = model("ClubModel", ClubSchema);
