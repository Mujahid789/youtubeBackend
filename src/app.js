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

app.get('/user', (req, res) => {
    res.send(`i am mujahid`);
    // res.send(`user ${req.params.id}`)
  })
  app.use('/user/profile/:userName', (req,res)=>{
    res.send(`user profile is ${req.params.userName}`);
})


export {app}