import express, { Application } from "express";
import cors from 'cors';
import router from "./routes/user.routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', router)

export default app;