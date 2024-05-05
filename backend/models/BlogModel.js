const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
    {
        title: String,
        summary: String,
        content: String,
        author: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
    }
);
export const BlogModel = model("BlogModel", PostSchema);