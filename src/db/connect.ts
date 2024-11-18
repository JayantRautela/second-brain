import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`Mongo db connected ${connection}`);
    } catch (error) {
        console.log(`error while connecting to database ${error}`);
    }
}

export default connectDB;