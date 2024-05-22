"use server";

import connectDB from "@/config/database";
import PostModel from "@/_models/post-model";

connectDB();

interface ILikePost {
    postId: string;
    userId: string;
}

export const likePost = async ({ postId, userId }: ILikePost) => {
    try {
        await PostModel.findByIdAndUpdate(postId, {
            $push: {
                likedBy: userId,
            },
        });

        return {
            success: true,
            message: "Post liked successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const unlikePost = async ({ postId, userId }: ILikePost) => {
    try {
        await PostModel.findByIdAndUpdate(postId, {
            $pull: {
                likedBy: userId,
            },
        });

        return {
            success: true,
            message: "Post unliked successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const getPostLikes = async (postId: string) => {
    try {
        const postWithLikedUsers = await PostModel.findById(postId).populate(
            "likedBy"
        );

        return {
            success: true,
            data: JSON.parse(JSON.stringify(postWithLikedUsers?.likedBy)),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};