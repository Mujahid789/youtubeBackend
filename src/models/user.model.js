import { Timestamp } from "mongodb";
import mongoose, {Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    userName:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required :true,
        usique: true,
        lowercase: true,
        trim: true
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // we will cloudinary url for storing files
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, "password is required"]
    },
    refreshToken:{
        type : String,
        
    },
    
         
}, {timestamps: true})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password, 10)
        next();
     
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
   return Jwt.sign({ ///// payload
        _id: this.id,
        email: this.email,
        userName : this.userName,
        fullName : this.fullName,

    },
        process.env.ACCESS_TOKEN_SECRET, ////secret Key
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY, // expiry token 
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign({ ///// payload
        _id: this.id,
        

    },
        process.env.REFRESH_TOKEN_SECRET, //// refresh token secret Key
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY, // expiry refresh token 
        }
    )
}



export const User = mongoose.model("User", userSchema);