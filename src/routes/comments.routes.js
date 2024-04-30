import { Router } from "express";
import { 
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
 }
  from "../consrollers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router()

router.use(verifyJWT)
// router.route("/getVideoCommet/:videoId").get(getVideoComments)
router.route("/addComent/:videoId").get(getVideoComments).post(addComment)
router.route("/updateComment/:commentId").delete(deleteComment).patch(updateComment)

export default router
