import { getRootLevelCommentsOfPost } from '@/_actions/comment-actions';
import Spinner from '@/components/spinner';
import { Modal, message } from 'antd';
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Comment from '@/components/comment/comment';

interface IProps {
    showCommentsModal: boolean;
    setShowCommentsModal: (show: boolean) => void;
    post: PostType;
}

const CommentsModal = (props: IProps) => {
    const { showCommentsModal, setShowCommentsModal, post } = props;

    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [rootLevelComments, setRootLevelComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const getRootLevelComments = async () => {
        try {
            setLoading(true);
            const response = await getRootLevelCommentsOfPost(post._id);
            if (response.success) {
                setRootLevelComments(response.data);
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
        getRootLevelComments();
    }, []);

    return (
        <>
            <Modal
                open={showCommentsModal}
                onCancel={() => setShowCommentsModal(false)}
                footer={null}
                centered
            >
                <div className='grid lg:grid-rows-2 mt-5 gap-5'>
                    <div className='relative'>
                        <img
                            src={post.media[selectedMediaIndex]}
                            className='w-full'
                        />

                        {post.media.length > 1 && (
                            <div className='absolute inset-0 flex items-center justify-between px-[5px]'>
                                <CircleChevronLeft
                                    className={`${selectedMediaIndex === 0 ? 'opacity-0' : ''}`}
                                    onClick={() => setSelectedMediaIndex(selectedMediaIndex - 1)}
                                    color='white'
                                    fill='gray'
                                />
                                <CircleChevronRight
                                    color='white'
                                    fill='gray'
                                    className={`${selectedMediaIndex === post.media.length - 1
                                        ? 'opacity-0'
                                        : ''
                                        }`}
                                    onClick={() => setSelectedMediaIndex(selectedMediaIndex + 1)}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        {loading && (
                            <div className='h-40 w-full flex items-center justify-center'>
                                <Spinner />
                            </div>
                        )}

                        <div className='flex flex-col gap-7'>
                            {rootLevelComments.map((comment: CommentType) => (
                                <Comment comment={comment} key={comment._id} />
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>

    );
}

export default CommentsModal;
