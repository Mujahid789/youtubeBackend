import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinay } from "../utils/cloudinary.js";



const publishVideo = asyncHandler(async(req,res)=>{
    // User.findOne({})
const {title,description}=req.body
const user =req.user?._id

console.log("request is comming at video controller");
if(
    [title,description].some(element =>{
        element?.trim()===""
    })
){
    throw new ApiError(400, "all Fields are required")
}

const videoLocalPath = req.files?.videoFile[0]?.path;

if(!videoLocalPath){
    throw new ApiError(400, "video file is required")
}
const video =await uploadOnCloudinay(videoLocalPath)
console.log(video);
if(!video){
    throw new ApiError(400, "video not found")
}

const result = await Video.create(
    {
        videoFile:video.url,
        title:title,
        description : description,
        owner:user,
        duration : video.duration
       
    }
)

if(!result){
    throw new ApiError(400, "error in video upload ")
}
return res.status(201).json(
        new ApiResponse(200, result, "user registered successfully")
      )


})

const getAllVideos = asyncHandler(async(req, res)=>{
    // const {page = 1, limit = 10, query , sortBy, sortType, userId } =req.query

    
    
    const {page = 1, limit = 10, query, userId} =req.query
    if([query, userId].some(element=>(!element)||element.trim()==="")){
        throw new ApiError(400, "query and userId required")
    }
    console.log(req.query);
    const videos =await Video.find({owner:userId}).sort({ createdAt: -1 })

    return res.status(200)
    .json(new ApiResponse(200, videos, "videos fatched successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {

    const {getVideoById} = req.params
    
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(getVideoById)
            },
            
        },
        // {
        //     $project: {
        //         _id: 1,
        //         videoFile: 1
        //     }
        // }
    ]);
    
   if(!video.length>0){
    throw new ApiError(400, "video not found")
   }
    
    return res
        .status(200)
        .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
        const { videoId } = req.params
        console.log("param videoId", videoId)
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError(400, "video Id required")
    }
    
   const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "video Not found")
    }
    const userId= req.user?._id
    if(!(userId.equals(video.owner))){
        throw new ApiError(401, "unauthorized access")
    }
    
    const { title , description}=req.body
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    console.log(thumbnailLocalPath);
    
    // console.log(title)  

    if(title){
        video.title=title
    }
    if(description){
        video.description =description
    }
    if (thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinay(thumbnailLocalPath)
        console.log(thumbnail)
        video.thumbnail=thumbnail.url
    }
    const result =await video.save()

    return res.
    status(200)
    .json(
        new ApiResponse(201, result, "video updated successfully" )
    )
    

    


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId =req.user?._id
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400, "video not found")
    }

    const video =await Video.findById(videoId)

    if(!(userId.equals(video.owner))){
        throw new ApiError(401, "Unauthorized Access")
    }
    const result = await Video.deleteOne(video)

    return res.
    status(200)
    .json(
        new ApiResponse(200, result, "document deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})


export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}