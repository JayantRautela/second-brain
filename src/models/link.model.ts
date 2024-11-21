import mongoose from "mongoose";

export interface LinkDocument extends mongoose.Document {
    hash: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}

const linkSchema = new mongoose.Schema({
    hash: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
}, { timestamps : true});

const Link = mongoose.model<LinkDocument>("Link", linkSchema);

export default Link;