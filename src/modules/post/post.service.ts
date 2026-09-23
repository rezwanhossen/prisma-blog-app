import { Strict } from "./../../../generated/prisma/internal/prismaNamespace";
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getPosts = async () => {
  const restlt = await prisma.post.findMany();
  return restlt;
};
export const postServices = {
  createPost,
  getPosts,
};
