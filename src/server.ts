import express, { Request, Response } from 'express';
import connectDB from './db/connect';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello form server");
})

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server started at port ${port}`);
    })
})
.catch((error) => {
    console.log(error.message);
    process.exit(1);
});