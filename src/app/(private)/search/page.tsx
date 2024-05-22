'use client';
import { searchPosts } from '@/_actions/post-actions';
import { searchUsers } from '@/_actions/user-actions';
import PostsSearchResults from '@/components/search/posts-search-results';
import UsersSearchResults from '@/components/search/users-search-result';
import { Button, Input, Radio, message } from 'antd';
import { useState } from 'react';

const Search = () => {
    const [searchFor, setSearchFor] = useState<"users" | "posts">("users");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const [loading, setLoading] = useState(false);

    const searchHandler = async () => {
        try {
            setLoading(true);
            let response: any = null;
            if (searchFor === "users") {
                response = await searchUsers(searchValue);
            } else {
                response = await searchPosts(searchValue);
            }
            if (response.success) {
                if (searchFor === "users") {
                    setUsers(response.data);
                } else {
                    setPosts(response.data);
                }
            } else {
                message.error(response.message);
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex gap-5 mt-5">
                <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search Users , Posts , Hashtags"
                />
                <Button type="primary" onClick={searchHandler} loading={loading}>
                    Search
                </Button>
            </div>

            <div className="mt-5 flex gap-5 items-center">
                <span>Search For</span>
                <Radio.Group
                    onChange={(e) => setSearchFor(e.target.value)}
                    value={searchFor}
                >
                    <Radio value="users">Users</Radio>
                    <Radio value="posts">Posts</Radio>
                </Radio.Group>
            </div>

            {searchFor === "users" ? (
                <UsersSearchResults users={users} />
            ) : (
                <PostsSearchResults posts={posts} />
            )}
        </div>
    )
}

export default Search;