import { Router } from "express";
import { 
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory, 
    logOutUser,
    refreshAccessToken,
    registerUser, 
    updateAccountDetails,
    updateCoverImage, 
    updateUserAvatar, 
    userLogin 
} from "../consrollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
refreshAccessToken
const router = Router()

router.route("/register").post(
    upload.fields([
        { 
            name:"avatar",
            maxCount:1,

        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )
// router.route("/login").post(login)

router.route("/login").post(userLogin);

// secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT ,getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/upload-cover").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router
