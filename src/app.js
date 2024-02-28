import express, { request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

}));
// express.json()
app.use(express.json({limit:"16kb"}))
// urlencoded is to take data from url
app.use(express.urlencoded({extended:true, limit:"16kb"}))
// express. static is used to store static files
app.use(express.static("public"))
// cookieParser is used to get and set data in user's browser cookies 
app.use(cookieParser());


// routes import 
import userRouter from "./routes/user.routes.js";

app.use('/api/v1/users', userRouter)


export {app}