import { Router } from "express";
import { 
    getAllVideos, 
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
    
} from "../consrollers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
verifyJWT
const videoRouter =Router()
videoRouter.route("/uploadVideo").post(
upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    // {
    //     name :"thumbnail",
    //     maxCount:1
    // },
    
]) ,
verifyJWT,
publishVideo
)

videoRouter.route("/getAllVideos").get(verifyJWT,getAllVideos)
videoRouter.route("/v/:getVideoById").get(verifyJWT, getVideoById)
videoRouter.route("/updateVideo/:videoId").patch(
    upload.fields([
        // {
        //     name:"videoFile",
        //     maxCount:1
        // },
        {
            name :"thumbnail",
            maxCount:1
        },
        
    ]) ,
    verifyJWT,
     updateVideo
) 

videoRouter.route("/deleteVideo/:videoId").delete(verifyJWT, deleteVideo)






export default videoRouter