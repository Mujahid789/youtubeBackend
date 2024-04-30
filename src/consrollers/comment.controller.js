import mongoose from "mongoose";
// import { User } from "../models/user.model.js";
// import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
    if(!videoId){
        throw new ApiError(400,"video id required")
    }
    const result = await Comment.find().sort("-createdAt") 
    if(!result){
        throw new ApiError(400, "no comments found")
    }

    return res.
    status(200)
    .json(
        new ApiResponse(200, result, "comments fatched successfully")
    )

})

const addComment = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    // console.log('videoId : ', videoId);
    const {txt} = req.body
    const userId = req.user?._id
    
    if([videoId, txt, userId].some((element)=>!element)){
        throw new ApiError(400 , "description,video or user required")
    }
    const result =await Comment.create({
        comment:txt,
        video:videoId,
        owner:userId
    })

    return res.
    status(200)
    .json(new ApiResponse(200, result, "commented successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    
    const {commentId}=req.params
    const {txt} = req.body
    // console.log('userId : ', req.user._id);
    const userid =req.user?._id

    const coments = await Comment.findOneAndUpdate(
        {
            _id:commentId,
            owner:userid
        },
        {
            $set:{comment:txt}
        },
        {upsert:true, new:false}
    )
    
    console.log('comment : ',coments);

    if(!coments){
        throw new ApiError(400 , "something went wrong in updation")
    }

   return res.status(200)
   .json( new ApiResponse(200, coments, "updated successfully") )

    

})

const deleteComment = asyncHandler(async (req, res) => {

    const {commentId} =req.params
    const userId = req.user?._id
console.log(userId);
    const result = await Comment.findOneAndDelete(
        {
            _id:commentId,
            owner: userId
        }
    )

    if(!result){
        throw new ApiError(404, "comment not found")
    }
    return res.status(200)
    .json(new ApiResponse(200, result, "comment deleted successfully"))
    
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }

