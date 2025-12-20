type PostProps = {
  post: Post;
};

export default function Post({ post }: PostProps) {
  return (
    <div className="post">
      <p>
        <b>Post #{post.id}</b> ({post.createdAt.toDateString()},{' '}
        {post.createdAt.toLocaleTimeString()})
      </p>
      <p className="emoji">{post.emoji}</p>
    </div>
  );
}
