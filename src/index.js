// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: "./.env",
});

connectDB()
.then(()=>{
    let port  = process.env.PORT || 7000 ;
    app.listen(port, (req,res)=>{
        console.log(`server is running at port ${port}`);
    })
})
.catch((err)=>{
    console.log(`DB connection faild !!!! `, err)
})











/*
(async ()=>{
     try {

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error', (error)=>
        {console.log("error", error)
        throw error
    })
    const port=process.env.PORT

    app.listen(port, (req, res) => {
        console.log(`server is lesting on ${port}`)
    })

       
     } catch (error) {

        console.log(`Error ${error}`);
        throw err
        
     }
})();
*/


