export default function Post({ post }: { post: Post }) {
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
