import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinay } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"




const generateAccessAndRefreshTokens = async(userId)=>{
    try {
      const user=await User.findOne(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken =refreshToken;
      await user.save({validateBeforSave: false})
      return {accessToken, refreshToken}
    } catch (error) {
      throw new ApiError (500, "something went wrong while generating access or refresh token")
    }
}



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
        // console.log("req.files : ", req.files);
       
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

/////////////////////////// login controller

const userLogin = asyncHandler(async(req, res)=>{

   // get data from req.body
   // check user exist or not with user name or email
   // compare password 
   // generate access and refesh token
   // send token in cookie

   const {email, userName, password}= req.body
   
   if(!(email || userName)){
    throw new ApiError(400, "userName or password is required")
   }

   const user=await User.findOne({$or :[{email}, {userName}]})
   if(!user){
    throw new ApiError(404, "user not exists")
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if(!isPasswordValid){
    throw new ApiError(401, "user name or password is incorrect")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
     // i again get user becaous now user has tokens before this use has epmty tokens
   const logedInUser = User.findOne(user._id).select("-password -refreshToken")
    
   const options = {
      httpOnly : true,
      secure : true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          // user : logedInUser, accessToken, refreshToken
          user
          
        },
        "user logedIn successfully"
        )
    )

})

const logOutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken : undefined
        }
    },
    {
      new : true
    }
    )

    const options = {
      httpOnly : true,
      secure : true,
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "user logedOut"))
})

// to refresh access token
const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401, "unAuthorized request refresh token not available")
  }

 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken, 
     process.env.REFRESH_TOKEN_SECRET
   )
 
   const user = await User.findById(decodedToken?._id)
   if(!user){
     throw new ApiError(401, "invalid refresh Token")
   }
 
   if(incomingRefreshToken!==user.refreshToken){
     throw new ApiError(401, "Refresh token is expired or used")
   }
 
   const options = {
     httpOnly : true,
     secure : true,
   }
 
   const {newAccessToken, newRefreshToken} =await generateAccessAndRefreshTokens(user._id)
 
   return res
   .status(200)
   .cookie("newAccessToken", newAccessToken, options)
   .cookie("newRefreshToken", newRefreshToken, options)
   .json(
     new ApiError(
       200,
       {
 
       },
       "Access Token Refreshed successfully"
        )
   )
 } catch (error) {

  throw new ApiError(401, error?.message || "Invalid Refresh token")
  
 }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword} =req.body

   const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid Password")
   }

   user.password = newPassword
   await user.save({validateBeforSave: false })
   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Passaord Updated"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200, req.user, "User fctched")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {email, fullName } = req.body

  if(!email || !fullName){
    throw new ApiError(400 ,"all feilds are required")
  }
   
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set:{
      email:email,
      fullNme:fullName
    }
  },{new : true}).select("-password")
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "user Updated Successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
  const avatarLocalPath = req.file?.path;

  if(!avatarLocalPath){
   throw ApiError(400 , "Avatar file is missing")
  }
 
  const avatar = await uploadOnCloudinay (avatarLocalPath) 

  if(!avatar.url){
      throw new ApiError(400 , "Error in uploading avatar")
  }

   const user = await User.findByIdAndUpdate(req.user?._id, {
      $set:{
        avatar : avatar.url
      }
   },
   {new : true}
   ).select("-password")

   return res
  .status(200)
  .json(
    new ApiResponse(200, user, "image updated")
  )

})

const updateCoverImage = asyncHandler(async(req,res)=>{
  const coverImageLocalPath = req.file?.path
  if(!coverImageLocalPath){
    throw new ApiError(400, "Cover Image is missing")
  }

  const coverImage =await uploadOnCloudinay(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error in file Uploading")
  }

  const user =await User.findByIdAndUpdate(req.user?._id, {
    $set:{
      coverImage:coverImage.url
    }
  },
  {new:true}).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "Cover image updated")
  )

})


export {
  registerUser,
  userLogin,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,

}