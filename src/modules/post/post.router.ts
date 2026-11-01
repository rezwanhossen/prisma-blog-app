import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();
router.get("/", postController.getpost);
router.post("/", auth(UserRole.USER), postController.createpost);

export const postRouter = router;
