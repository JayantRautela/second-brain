import mongoose from "mongoose";

export interface ContentDocument extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    link: string;
    title: string;
    type: "audio" | "video" | "image" | "article";
    createdAt: Date;
    updatedAt: Date;
}

const contentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['audio', 'video', 'image', 'article'],
        required: true
    }
}, { timestamps: true });

const Content = mongoose.model<ContentDocument>('Content', contentSchema);

export default Content;