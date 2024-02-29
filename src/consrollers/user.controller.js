import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinay } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler (async(req, res)=>{

    //get user details from front end like from registration form
    // validation not empty  and is user sending proper data
    // check if user already exist
    // check for images , check for avatar 
    // upload them to cloudinary , check avtar uploaded or not
    // create user object and create entry in db
    // remove password and refresh token field from response when user created
    // check fro user creation
    // return response

    
    const {userName,email,fullName,password}=req.body
   
    if(
        [userName, email, fullName, password].some((element)=>(
            element?.trim()===""
        ))
        ){
            throw new ApiError(400, "All fields are required")
        }
    
    
       const existedUser=await User.findOne({
            $or : [{ userName }, { email }]
        })
        if (existedUser){
            throw new ApiError(409, "User already exist " )
        }
        console.log("req.files : ", req.files);
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImgLocalPath = req.files?.coverImage[0]?.path;
         

        let coverImgLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
             coverImgLocalPath = req.files.coverImage[0].path
        }

        

        if(!avatarLocalPath){
            throw new ApiError(400, "avatar file is required")
        }
     // if local path is nothing then return empty string
      const avatar = await uploadOnCloudinay(avatarLocalPath);
      const coverImage = await uploadOnCloudinay(coverImgLocalPath); 

      if(!avatar){
        throw new ApiError(400, "avatar file is required");
      }

        const user =await User.create({
        fullName:fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        userName:userName.toLowerCase(),
        email:email,
        password

      })

      const createdUser = await User.findById(user._id).select("-password -refreshToken")

      if(!createdUser){
        throw new ApiError(500, "user not created something went wrong")
      }

      res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
      )
    
})

export {registerUser}