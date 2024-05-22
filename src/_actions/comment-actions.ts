"use server";

import connectDB from "@/config/database";
import CommentModel from "@/_models/comment-model";
import PostModel from "@/_models/post-model";

connectDB();

interface ICommentPost {
    payload: any;
    postId: string;
}

export const addNewComment = async ({ payload, postId }: ICommentPost) => {
    try {
        await CommentModel.create(payload);
        await PostModel.findByIdAndUpdate(postId, {
            $inc: { commentsCount: 1 },
        });

        return {
            success: true,
            message: "Comment added successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const replyToAComment = async ({ payload, postId }: ICommentPost) => {
    try {
        await CommentModel.create(payload);
        await PostModel.findByIdAndUpdate(postId, {
            $inc: { commentsCount: 1 },
        });
        await CommentModel.findByIdAndUpdate(payload.replyTo, {
            $inc: { repliesCount: 1 },
        });

        return {
            success: true,
            message: "Replied to the comment successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const getRootLevelCommentsOfPost = async (postId: string) => {
    try {
        const comments = await CommentModel.find({
            post: postId,
            isReply: false,
        }).populate("user");
        return {
            success: true,
            data: JSON.parse(JSON.stringify(comments)),
        };
    } catch (error: any) {
        return {
            message: error.message,
            success: false,
        };
    }
};

export const getRepliesOfAComment = async (commentId: string) => {
    try {
        const replies = await CommentModel.find({
            replyTo: commentId,
        }).populate("user");
        return {
            success: true,
            data: JSON.parse(JSON.stringify(replies)),
        };
    } catch (error: any) {
        return {
            message: error.message,
            success: false,
        };
    }
};

