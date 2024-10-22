import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    img: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            text: { // Add a key for comment text
                type: String,
                required: true
            },
            user: { // The user who made the comment
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
