'use server';

import connectDB from '@/config/database';
import PostModel from '@/_models/post-model';
import { getCurrentUserFromDB } from './user-actions';
import { revalidatePath } from 'next/cache';

connectDB();

interface IPostsByType {
  userId: string;
  type: "uploaded" | "tagged" | "saved" | "archived";
}
interface IPostUser {
  postId: string;
  userId: string;
}

export const uploadNewPost = async (payload: any) => {
  try {
    await PostModel.create(payload);
    revalidatePath("/");
    return {
      success: true,
      message: "Post uploaded successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getTimelinePostsOfLoggedInUser = async () => {
  try {
    const currentUser = await getCurrentUserFromDB();
    const currentUserId = currentUser.data._id;

    const posts = await PostModel.find({
      $or: [
        { user: currentUserId },
        { user: { $in: currentUser.data.following } },
      ],
      isArchived: false,
    }).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostsOfUserByType = async ({ userId, type, }: IPostsByType) => {
  try {
    let postsToReturn: any[] = [];

    switch (type) {
      case "uploaded":
        postsToReturn = await PostModel.find({
          user: userId,
          isArchived: false,
        }).populate("user");
        break;
      case "tagged":
        postsToReturn = await PostModel.find({
          tags: {
            $in: [userId],
          },
        }).populate("user");
        break;
      case "saved":
        postsToReturn = await PostModel.find({
          savedBy: {
            $in: [userId],
          },
        }).populate("user");
        break;
      case "archived":
        postsToReturn = await PostModel.find({
          user: userId,
          isArchived: true,
        }).populate("user");
        break;
      default:
        postsToReturn = [];
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(postsToReturn)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(post)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getTagsOfPost = async (postId: string) => {
  try {
    const postWithTags = await PostModel.findById(postId).populate(
      'tags'
    );
    return {
      success: true,
      data: JSON.parse(JSON.stringify(postWithTags?.tags)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};


export const savePost = async ({ postId, userId }: IPostUser) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      $push: { savedBy: userId },
    });

    return {
      success: true,
      message: "Post saved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unsavePost = async ({ postId, userId }: IPostUser) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { savedBy: userId },
    });

    return {
      success: true,
      message: "Post unsaved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const archivePost = async (postId: string) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      isArchived: true,
    });

    return {
      success: true,
      message: "Post archived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unarchivePost = async (postId: string) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      isArchived: false,
    });

    return {
      success: true,
      message: "Post unarchived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const searchPosts = async (searchValue: string) => {
  try {
    const posts = await PostModel.find({
      $or: [
        { caption: { $regex: searchValue, $options: "i" } },
        { hashTags: { $in: [searchValue] } },
      ],
    }).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
