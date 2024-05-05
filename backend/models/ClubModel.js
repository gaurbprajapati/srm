import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ClubSchema = new Schema(
    {
        title: String,
        discription: String,
        observation: String,
        achievement: { type: Array, default: [] },
        cover: String,
        category: String,
        president: String,
        vicePresident: String,
        whatup: String,
        instagram: String,
        linkedin: String,
        discord: String,
        memberName: { type: Array, default: [] },
        facultyName: { type: Array, default: [] },
        announcment: { type: Array, default: [] },
    },
    {
        timestamps: true,
    }
);
export const ClubModel = model("ClubModel", ClubSchema);
