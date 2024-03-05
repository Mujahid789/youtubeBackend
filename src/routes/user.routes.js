import { Router } from "express";
import { logOutUser, refreshAccessToken, registerUser, userLogin } from "../consrollers/user.controller.js";
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



export default router
