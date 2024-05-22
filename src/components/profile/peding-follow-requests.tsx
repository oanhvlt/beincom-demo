'use client';

import { acceptFollowRequest, rejectFollowRequest } from '@/_actions/follow-requests';
import { getFollowRequestReceived } from '@/_actions/user-actions';
import useUsersStore, { UsersStoreType } from '@/store/users';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type loadingTypes =
    | 'accepting follow request'
    | 'rejecting follow request'
    | '';

interface IUser {
    user: UserType;
}

const PendingFollowRequests = ({ user }: IUser) => {
    const [followRequests, setFollowRequests] = useState([]);
    const { loggedInUserData }: UsersStoreType = useUsersStore();
    const [loading, setLoading] = useState<loadingTypes>('');
    const router = useRouter();

    if (user._id !== loggedInUserData?._id) {
        return null;
    }

    const fetchFollowRequests = async () => {
        try {
            const response = await getFollowRequestReceived(
                loggedInUserData?._id || ''
            );
            if (response.success) {
                setFollowRequests(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleAcceptFollowRequest = async (senderId: string) => {
        try {
            setLoading('accepting follow request');
            const response = await acceptFollowRequest({
                followReqSenderId: senderId,
                followReqReceiverId: loggedInUserData?._id || '',

            });
            if (response.success) {
                message.success(response.message);
                fetchFollowRequests();
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading('');
        }
    };

    const handleRejectFollowRequest = async (senderId: string) => {
        try {
            setLoading('rejecting follow request');
            const response: any = await rejectFollowRequest({
                followReqSenderId: senderId,
                followReqReceiverId: loggedInUserData?._id || '',
            });
            if (response.success) {
                message.success(response.message);
                fetchFollowRequests();
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading('');
        }
    };

    useEffect(() => {
        fetchFollowRequests();
    }, []);

    return (
        <div className='mt-10 p-5 bg-gray-50 border border-gray-200 border-solid'>
            <h1 className='text-sm text-primary'>Pending Follow Requests</h1>
            {followRequests.length === 0 && !loading && (
                <span className='text-gray-500 text-sm'>
                    No pending follow requests
                </span>
            )}
            {followRequests.length > 0 && (
                <div className='flex flex-wrap gap-5 mt-7'>
                    {followRequests.map((sender: UserType) => (
                        <div className='flex gap-5 items-center bg-third p-2 border border-solid border-gray-300'>
                            <img
                                src={sender.profilePic}
                                alt={sender.name}
                                className='w-12 h-12 rounded-full object-cover'
                            />

                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-700 text-sm'>{sender.name}</span>
                                <div className='flex gap-5'>
                                    <Button
                                        className='text-primary'
                                        size='small'
                                        onClick={() => router.push(`/profile/${sender._id}`)}
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        //className='text-success border-success bg-gray-50'
                                        type='primary'
                                        size='small'
                                        onClick={() => handleAcceptFollowRequest(sender._id)}
                                        loading={loading === 'accepting follow request'}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        type='link'
                                        size='small'
                                        //danger
                                        className='text-red-500 border-red-500 bg-gray-50'
                                        onClick={() => handleRejectFollowRequest(sender._id)}
                                        loading={loading === 'rejecting follow request'}
                                    >
                                        Reject
                                    </Button>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    )
}

export default PendingFollowRequests;