import { getFollowingOfUser } from '@/_actions/user-actions';
import Spinner from '@/components/spinner';
import { Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface IProps {
  showFollowingModal: boolean;
  setShowFollowingModal: (value: boolean) => void;
  user: UserType;
}

const FollowingModal = (props: IProps) => {
  const { showFollowingModal, setShowFollowingModal, user } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<UserType[]>([]);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFollowingOfUser(user._id);
      if (response.success) {
        setFollowing(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (showFollowingModal) {
      getData();
    }
  }, [showFollowingModal]);

  return (
    <Modal
      title='FOLLOWING'
      open={showFollowingModal}
      onCancel={() => setShowFollowingModal(false)}
      centered
      footer={null}
    >
      {loading && (
        <div className='h-40 flex justify-center items-center'>
          <Spinner />
        </div>
      )}

      {!loading && following.length === 0 && (
        <p className='text-center text-gray-500'>
          You are not following anyone
        </p>
      )}

      <div className='flex flex-col gap-3'>
        {following.map((item) => (
          <div
            className='flex gap-5 items-center border border-gray-300 border-solid p-2 rounded cursor-pointer'
            key={user._id}
            onClick={() => router.push(`/profile/${item._id}`)}
          >
            <img
              src={item.profilePic}
              alt='profile-pic'
              className='w-10 h-10 rounded-full'
            />
            <div className='text-sm'>
              <div className='font-semibold'>{item.name}</div>
              <div className='text-sm text-gray-500'>{item.email}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default FollowingModal;
