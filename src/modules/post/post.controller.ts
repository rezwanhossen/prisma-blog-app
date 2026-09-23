import { Request, Response } from "express";
import { postServices } from "./post.service";

const createpost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "unouthorized",
      });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "post create faild",
      details: error,
    });
  }
};
const getpost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getPosts();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "post create faild",
      details: error,
    });
  }
};
export const postController = {
  createpost,
  getpost,
};
