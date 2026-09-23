import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createpost);
// router.get("/", postController.getpost);
export const postRouter = router;
