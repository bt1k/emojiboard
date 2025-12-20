import Post from './Post';

type PostsListProps = {
  getPosts: () => Promise<void>;
  hasError: boolean;
  posts: Post[];
};

export default function PostsList({
  getPosts,
  hasError,
  posts,
}: PostsListProps) {
  return (
    <>
      <p>{posts.length} post(s) loaded (maximum: 10).</p>
      <p>
        <button onClick={getPosts}>Reload</button>
      </p>
      {hasError ? (
        <p className="error">There was an error when loading posts.</p>
      ) : (
        <div id="postsContainer">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
