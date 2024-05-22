import { getFollowersOfUser } from '@/_actions/user-actions';
import Spinner from '@/components/spinner';
import { Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IProps {
    showFollowersModal: boolean;
    setShowFollowersModal: (value: boolean) => void;
    user: UserType;
}

const FollowersModal = (props: IProps) => {
    const { showFollowersModal, setShowFollowersModal, user } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [followers, setFollowers] = useState<UserType[]>([]);
    const router = useRouter();


    const getData = async () => {
        try {
            setLoading(true);
            const response = await getFollowersOfUser(user._id);
            if (response.success) {
                setFollowers(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showFollowersModal) {
            getData();
        }
    }, [showFollowersModal]);

    return (
        <Modal
            title='FOLLOWERS'
            open={showFollowersModal}
            onCancel={() => setShowFollowersModal(false)}
            centered
            footer={null}
        >
            {loading && (
                <div className='h-40 flex justify-center items-center'>
                    <Spinner />
                </div>
            )}

            {!loading && followers.length === 0 && (
                <p className='text-center text-gray-500'>No followers</p>
            )}

            <div className='flex flex-col gap-3'>
                {followers.map((follower) => (
                    <div
                        className='flex gap-5 items-center border border-gray-300 border-solid p-2 rounded cursor-pointer'
                        key={follower._id}
                        onClick={() => router.push(`/profile/${follower._id}`)}
                    >
                        <img
                            src={follower.profilePic}
                            alt='profile-pic'
                            className='w-10 h-10 rounded-full'
                        />
                        <div className='text-sm'>
                            <div className='font-semibold'>{follower.name}</div>
                            <div className='text-sm text-gray-500'>{follower.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default FollowersModal;