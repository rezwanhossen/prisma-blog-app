import { Request, Response } from "express";
import { postServices } from "./post.service";

const createpost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body);
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
