import express from "express";
import { postController } from "./post.controller";
const router = express.Router();
router.post("/", postController.createpost);
router.get("/", postController.getpost);
export const postRouter = router;
