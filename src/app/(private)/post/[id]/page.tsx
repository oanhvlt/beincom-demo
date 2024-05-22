import { getPostById } from "@/_actions/post-actions";

const PostInfoPage = async ({ params }: { params: { id: string } }) => {
  const response = await getPostById(params.id);
  const post = response.data;
  if (!post) {
    return <div className="text-gray-500 text-sm">Post not found</div>;
  }
  return (

    <div className="grid lg:grid-cols-8 mb-5">
      <div className="col-span-2">
      </div>
      <div className="col-span-4">
        {/* <PostItem post={post} type="feed" /> */}
        Detail post
      </div>
      <div className="col-span-2">
      </div>
    </div>
  );
}

export default PostInfoPage;
