'use client';
import useUsersStore, { UsersStoreType } from '@/store/users';
import { useState } from 'react';
import EditProfileModal from '@/components/profile/edit-profile-modal';
import { Button, message } from 'antd';
import { cancelFollowRequest, sendFollowRequest, unfollowUser } from '@/_actions/follow-requests';
import FollowersModal from '@/components/profile/followers-modal';
import FollowingModal from '@/components/profile/following-modal';

interface IUser {
    user: UserType;
}

const UserBasicDetails = (props: IUser) => {
    const { user } = props;

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const { loggedInUserData, setLoggedInUserData }: UsersStoreType = useUsersStore();
    const showEditProfileBtn = user._id === loggedInUserData?._id;

    const followRequestSent = loggedInUserData?.followRequestsSent?.includes(
        user._id
    );

    const alreadyFollowing = loggedInUserData?.following?.includes(user._id);

    const showFollowBtn = user._id !== loggedInUserData?._id &&
        !followRequestSent && !alreadyFollowing;

    const [loading, setLoading] = useState<'sending-follow-request'
        | 'cancelling-follow-request'
        | 'unfollowing-user'
        | ''
    >('');

    const canSeeFollowersAndFollowing =
        loggedInUserData?._id === user._id ||
        (user.isPrivateAccount && alreadyFollowing) ||
        !user.isPrivateAccount;

    const followHandler = async () => {
        try {
            setLoading('sending-follow-request');
            const response = await sendFollowRequest({
                followReqSenderId: loggedInUserData?._id || '',
                followReqReceiverId: user._id,
            });
            if (response.success) {
                message.success(response.message);
                setLoggedInUserData(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading('');
        }
    };

    const unfollowHandler = async () => {
        try {
            setLoading('unfollowing-user');
            const response = await unfollowUser({
                senderId: loggedInUserData?._id || '',
                receiverId: user._id,
            });

            if (response.success) {
                message.success(response.message);
                setLoggedInUserData(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading('');
        }
    };

    const cancellFollowRequestHandler = async () => {
        try {
            setLoading('cancelling-follow-request');
            const response = await cancelFollowRequest({
                followReqSenderId: loggedInUserData?._id || '',
                followReqReceiverId: user._id,
            });
            if (response.success) {
                message.success(response.message);
                setLoggedInUserData(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading('');
        }
    };

    return (
        <div className='flex lg:flex-row flex-col gap-10 lg:items-center px-5'>
            <div>
                <img
                    src={user.profilePic}
                    alt={user.name}
                    className='w-32 h-32 rounded-full object-cover'
                />
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex gap-5'>
                    <span className='font-bold text-xl text-primary'>{user.name}</span>
                    {showEditProfileBtn && ( //only logged-in user can edit profile
                        <Button onClick={() => setShowEditProfileModal(true)}>
                            Edit Profile
                        </Button>
                    )}

                    {showFollowBtn && (
                        <Button
                            loading={loading === 'sending-follow-request'}
                            onClick={followHandler}
                        >
                            Follow
                        </Button>
                    )}

                    {followRequestSent && (
                        <div className='flex items-center gap-5'>
                            <span className='text-gray-500 text-sm font-semibold'>
                                Follow Request Sent
                            </span>
                            <Button
                                type='primary'
                                size='small'
                                onClick={cancellFollowRequestHandler}
                                danger
                                loading={loading === 'cancelling-follow-request'}
                            >
                                Cancel Request
                            </Button>
                        </div>
                    )}

                    {alreadyFollowing && (
                        <div className='flex items-center gap-5'>
                            <span className='text-gray-500 text-sm font-semibold'>
                                Following
                            </span>
                            <Button
                                type='primary'
                                size='small'
                                onClick={unfollowHandler}
                                danger
                                loading={loading === 'unfollowing-user'}
                            >
                                Unfollow
                            </Button>
                        </div>
                    )}
                </div>
                <div className='flex gap-12 text-gray-500 text-sm'>
                    <div className='flex gap-1'>
                        <span className='font-bold'>0</span>
                        <span>Posts</span>
                    </div>

                    <div className='flex gap-1'>
                        <span className='font-bold'>{user.followers.length}</span>
                        <span className='underline cursor-pointer'
                            onClick={() => {
                                if (canSeeFollowersAndFollowing) setShowFollowersModal(true);
                            }}
                        >
                            Followers
                        </span>
                    </div>

                    <div className='flex gap-1'>
                        <span className='font-bold'>{user.following.length}</span>
                        <span className='underline cursor-pointer'
                            onClick={() => {
                                if (canSeeFollowersAndFollowing) setShowFollowingModal(true);
                            }}
                        >
                            Following
                        </span>
                    </div>
                </div>
                <p className='text-gray-500 text-sm'>
                    {user.bio || 'This user has no bio yet.'}
                </p>
            </div>
            {showEditProfileModal && (
                <EditProfileModal user={user}
                    showEditProfileModal={showEditProfileModal}
                    setShowEditProfileModal={setShowEditProfileModal} />
            )}
            {showFollowersModal && (
                <FollowersModal
                    user={user}
                    showFollowersModal={showFollowersModal}
                    setShowFollowersModal={setShowFollowersModal}
                />
            )}

            {showFollowingModal && (
                <FollowingModal
                    showFollowingModal={showFollowingModal}
                    setShowFollowingModal={setShowFollowingModal}
                    user={user}
                />
            )}
        </div>
    )
}

export default UserBasicDetails;