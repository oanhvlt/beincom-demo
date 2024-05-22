'use client';

import { addNewComment } from '@/_actions/comment-actions';
import { likePost, unlikePost } from '@/_actions/like-actions';
import { getDateTimeFormat } from '@/helpers/date-time-formats';
import useUsersStore, { UsersStoreType } from '@/store/users';
import { Button, message } from 'antd';
import { Bookmark, CircleChevronLeft, CircleChevronRight, Heart, Share } from 'lucide-react';
import { useEffect, useState } from 'react';
import { archivePost, getTagsOfPost, savePost, unarchivePost, unsavePost } from '@/_actions/post-actions';
import { useRouter } from 'next/navigation';
import LikesModal from '@/components/like/likes-modal';
import CommentsModal from '@/components/comment/comments-modal';

type postType = 'feed' | 'uploaded' | 'tagged' | 'saved' | 'archived';
interface IProps {
    post: PostType;
    type?: postType;
    reloadData?: any;
}

function PostItem(props: IProps) {
    const { post, type = "feed", reloadData } = props;

    const { loggedInUserData, setLoggedInUserData }: UsersStoreType = useUsersStore();
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);


    const [tags, setTags] = useState<UserType[]>([]);

    const [liked, setLiked] = useState(post.likedBy.includes(loggedInUserData?._id!));
    const [likesCount, setLikesCount] = useState(post.likedBy.length || 0);
    const [showLikesModal, setShowLikesModal] = useState(false);

    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState(
        post.commentsCount || 0
    );

    const [showCommentsModal, setShowCommentsModal] = useState(false);

    const [saved = false, setSaved] = useState(post.savedBy.includes(loggedInUserData?._id!));

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const likeHandler = async () => {
        try {
            const response = await likePost({
                postId: post._id,
                userId: loggedInUserData?._id!,
            });

            if (response.success) {
                setLiked(true);
                setLikesCount(likesCount + 1);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const unlikeHandler = async () => {
        try {
            const response = await unlikePost({
                postId: post._id,
                userId: loggedInUserData?._id!,
            });
            if (response.success) {
                setLiked(false);
                setLikesCount(likesCount - 1);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleAddComment = async () => {
        try {
            setLoading(true);
            const payload = {
                post: post._id,
                user: loggedInUserData?._id!,
                content: commentText,
            };

            const response = await addNewComment({
                payload,
                postId: post._id,
            });

            if (response.success) {
                setCommentText('');
                message.success(response.message);
                setCommentsCount(commentsCount + 1);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const savePostHandler = async () => {
        try {
            const response = await savePost({
                postId: post._id,
                userId: loggedInUserData?._id!,
            });

            if (response.success) {
                setSaved(true);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const unsaveHandler = async () => {
        try {
            const response = await unsavePost({
                postId: post._id,
                userId: loggedInUserData?._id!,
            });

            if (response.success) {
                setSaved(false);
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const archivePostHandler = async () => {
        try {
            setLoading(true);
            const response = await archivePost(post._id);
            if (response.success) {
                message.success(response.message);
                reloadData();
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const unarchiveHandler = async () => {
        try {
            setLoading(true);
            const response = await unarchivePost(post._id);
            if (response.success) {
                message.success(response.message);
                reloadData();
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const getTags = async () => {
        try {
            setLoading(true);
            const response: any = await getTagsOfPost(post._id);
            if (response.success) {
                setTags(response.data);
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
        getTags();
    }, []);

    return (
        <div className="flex flex-col border border-gray-300 border-solid">
            <div className="flex gap-5 bg-gray-100 p-3 items-center">
                <img src={post.user.profilePic} className="w-10 h-10 rounded-full" />

                <div
                    className="flex flex-col cursor-pointer"
                    onClick={() => router.push(`/profile/${post.user._id}`)}
                >
                    <span className="tex-sm">{post.user.name}</span>
                    <span className="text-xs text-gray-500">
                        {getDateTimeFormat(post.createdAt)}
                    </span>
                </div>
            </div>

            <div className="relative cursor-pointer" onClick={() => { router.push(`/post/${post._id}`); }}>
                <img src={post.media[selectedMediaIndex]} className="w-full" />

                {post.media.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                        <CircleChevronLeft
                            className={`${selectedMediaIndex === 0 ? "opacity-0" : ""}`}
                            onClick={() => setSelectedMediaIndex(selectedMediaIndex - 1)}
                            color="white"
                            fill="gray"
                        />
                        <CircleChevronRight
                            color="white"
                            fill="gray"
                            className={`${selectedMediaIndex === post.media.length - 1 ? "opacity-0" : ""
                                }`}
                            onClick={() => setSelectedMediaIndex(selectedMediaIndex + 1)}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col p-2">
                <p className="mt-5 text-sm text-gray-700">
                    <b className="text-primary">@ {post.user.name}</b> {post.caption}
                </p>
                <div className="flex flex-row gap-1 pt-2">
                    <>
                        <span className="text-xs italic ">Tags: </span>
                        {tags?.map((user) => (
                            <span
                                className="text-xs italic text-info underline cursor-pointer"
                                key={user._id}
                                onClick={() => router.push(`/profile/${user._id}`)}
                            >
                                {'#'}{user.name}{','}
                            </span>
                        ))}
                    </>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                    <span className="text-xs italic">Topics: </span>
                    <span className="text-xs italic"> {post.hashTags.toString()}</span>
                </p>


                <div className="flex justify-between mt-5">
                    <div className="flex gap-5">
                        <Heart
                            size={16}
                            fill={liked ? '#cf79f2' : '#eeeeee'}
                            onClick={liked ? unlikeHandler : likeHandler}
                        />
                        <Share size={16} />
                    </div>

                    <Bookmark
                        size={16}
                        fill={saved ? "#8043cc" : "none"}
                        onClick={saved ? unsaveHandler : savePostHandler}
                    />
                </div>

                <div className="flex gap-10 mt-3">
                    <p
                        className="text-sm cursor-pointer font-semibold"
                        onClick={() => {
                            if (likesCount) {
                                setShowLikesModal(true);
                            }
                        }}
                    >
                        {likesCount} Likes
                    </p>
                    <p
                        className="text-sm font-semibold cursor-pointer"
                        onClick={() => {
                            if (commentsCount) {
                                setShowCommentsModal(true);
                            }
                        }}
                    >
                        {" "}
                        {commentsCount} Comments
                    </p>
                </div>

                {type === "feed" && (
                    <div className="flex gap-5 mt-3 items-center">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[85%] rounded"
                        />
                        {commentText && (
                            <Button onClick={handleAddComment} loading={loading} type="text">
                                Post
                            </Button>
                        )}
                    </div>
                )}

                {type === "uploaded" && post.user._id === loggedInUserData?._id && (
                    <div className="flex gap-5 mt-3 items-center">
                        {!post.isArchived ? (
                            <Button
                                danger
                                type="primary"
                                size="small"
                                onClick={archivePostHandler}
                            >
                                Archive
                            </Button>
                        ) : (
                            <Button type="primary" size="small" onClick={unarchiveHandler}>
                                Unarchive
                            </Button>
                        )}
                        <Button size="small" type="primary">
                            Edit
                        </Button>
                    </div>
                )}
            </div>

            {showLikesModal && (
                <LikesModal
                    post={post}
                    showLikesModal={showLikesModal}
                    setShowLikesModal={setShowLikesModal}
                />
            )}

            {showCommentsModal && (
                <CommentsModal
                    post={post}
                    showCommentsModal={showCommentsModal}
                    setShowCommentsModal={setShowCommentsModal}
                />
            )}
        </div>
    );
}

export default PostItem;
