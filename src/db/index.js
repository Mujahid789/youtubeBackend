import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import dotenv from "dotenv";

// dotenv.config()

const connectDB = async ()=>{
    try {
        console.log(process.env.MONGODB_URI);
        console.log(DB_NAME)
        const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
                
        console.log(`\n db connected successfully DB Host ${connectionDB.connection.host}`);
        
    } catch (error) {
        console.log("mongoDB connection error", error);
        process.exit(1);
    }
}
export default connectDB;