import { Router } from "express";
import { 
    getAllVideos, 
    publishVideo,
    getVideoById 
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




export default videoRouter