import { Router } from "express";
import { registerUser } from "../consrollers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
// router.route("/login").post(login)


export default router
