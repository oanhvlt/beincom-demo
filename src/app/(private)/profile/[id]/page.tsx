import { getUserInfoById } from '@/_actions/user-actions';
import PendingFollowRequests from '@/components/profile/peding-follow-requests';
import UserBasicDetails from '@/components/profile/user-basic-details';
import UserRelatedPosts from '@/components/profile/users-related-posts';

const Profile = async (
    { params }: { params: { id: string; } }) => {
    const userInfoResponse = await getUserInfoById(params.id);
    const userInfo = userInfoResponse.data;
    return (
        <div>
            <UserBasicDetails user={userInfo} />
            <PendingFollowRequests user={userInfo} />
            <UserRelatedPosts user={userInfo} />
        </div>
    )
}

export default Profile;