import { getPostLikes } from '@/_actions/like-actions';
import { Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IProps {
    showLikesModal: boolean;
    setShowLikesModal: (show: boolean) => void;
    post: PostType;
}


const LikesModal = (props: IProps) => {
    const { showLikesModal, setShowLikesModal, post } = props;

    const [loading, setLoading] = useState(false);
    const [usersLiked, setUsersLiked] = useState<UserType[]>([]);
    const router = useRouter();

    const getLikes = async () => {
        try {
            setLoading(true);
            const response: any = await getPostLikes(post._id);
            if (response.success) {
                setUsersLiked(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLikes();
    }, [showLikesModal]);

    return (
        <Modal
            open={showLikesModal}
            onCancel={() => setShowLikesModal(false)}
            footer={null}
            centered
            title='LIKES'
        >
            <div className='flex flex-col gap-5'>
                {usersLiked?.map((user) => (
                    <div
                        className='flex gap-3 items-center border border-gray-300 border-solid p-2 rounded cursor-pointer'
                        key={user._id}
                        onClick={() => router.push(`/profile/${user._id}`)}
                    >
                        <img
                            src={user.profilePic}
                            alt='profile-pic'
                            className='w-10 h-10 rounded-full'
                        />
                        <div className='text-sm'>
                            <div className='font-semibold'>{user.name}</div>
                            <div className='text-sm text-gray-500'>{user.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

export default LikesModal;
