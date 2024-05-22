'use server';

import connectDB from '@/config/database';
import UserModel from '@/_models/user-model';
import { revalidatePath } from 'next/cache';

connectDB();

interface IFollowRequest {
    followReqSenderId: string;
    followReqReceiverId: string;
}

export const sendFollowRequest = async ({ followReqSenderId, followReqReceiverId }: IFollowRequest) => {
    try {
        // add receiver id to senders followRequestsSent
        const newSenderDoc = await UserModel.findByIdAndUpdate(
            followReqSenderId,
            {
                $push: { followRequestsSent: followReqReceiverId },
            },
            { new: true }
        );

        // add sender id to receivers followRequestsReceived
        await UserModel.findByIdAndUpdate(followReqReceiverId, {
            $push: { followRequestsReceived: followReqSenderId },
        });

        revalidatePath(`/profile/${followReqReceiverId}`);

        return {
            success: true,
            message: 'Follow request sent successfully',
            data: JSON.parse(JSON.stringify(newSenderDoc)),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const acceptFollowRequest = async ({ followReqSenderId, followReqReceiverId }: IFollowRequest) => {
    try {
        // add senderid to receiver's followers and remove from followRequestsReceived
        await UserModel.findByIdAndUpdate(followReqReceiverId, {
            $push: { followers: followReqSenderId },
            $pull: { followRequestsReceived: followReqSenderId },
        });

        // add receiverid to sender's following and remove from followRequestsSent
        await UserModel.findByIdAndUpdate(followReqSenderId, {
            $push: { following: followReqReceiverId },
            $pull: { followRequestsSent: followReqReceiverId },
        });

        return {
            success: true,
            message: 'Follow request accepted successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const rejectFollowRequest = async ({ followReqSenderId, followReqReceiverId }: IFollowRequest) => {
    try {
        // remove senderid from receiver's followRequestsReceived
        await UserModel.findByIdAndUpdate(followReqReceiverId, {
            $pull: { followRequestsReceived: followReqSenderId },
        });

        // remove receiverid from sender's followRequestsSent
        await UserModel.findByIdAndUpdate(followReqSenderId, {
            $pull: { followRequestsSent: followReqReceiverId },
        });

        return {
            success: true,
            message: 'Follow request rejected successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const cancelFollowRequest = async ({ followReqSenderId, followReqReceiverId }: IFollowRequest) => {
    try {
        // remove receiverid from sender's followRequestsSent
        const newSenderDoc = await UserModel.findByIdAndUpdate(
            followReqSenderId,
            {
                $pull: { followRequestsSent: followReqReceiverId },
            },
            { new: true }
        );

        // remove senderid from receiver's followRequestsReceived
        await UserModel.findByIdAndUpdate(followReqReceiverId, {
            $pull: { followRequestsReceived: followReqSenderId },
        });

        return {
            success: true,
            message: 'Follow request cancelled successfully',
            data: JSON.parse(JSON.stringify(newSenderDoc)),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const unfollowUser = async ({
    senderId = '',
    receiverId = '',
}: {
    senderId: string;
    receiverId: string;
}) => {
    try {
        // remove receiverid from sender's following
        const newSenderDoc = await UserModel.findByIdAndUpdate(
            senderId,
            {
                $pull: { following: receiverId },
            },
            { new: true }
        );

        // remove senderid from receiver's followers
        await UserModel.findByIdAndUpdate(receiverId, {
            $pull: { followers: senderId },
        });

        return {
            success: true,
            message: 'Unfollowed user successfully',
            data: JSON.parse(JSON.stringify(newSenderDoc)),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};


