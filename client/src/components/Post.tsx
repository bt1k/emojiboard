import { dateGapAsRelativeTimeString } from '../utils';

type PostProps = {
  dateUpdatedEveryMinute: Date;
  post: Post;
};

export default function Post({ dateUpdatedEveryMinute, post }: PostProps) {
  return (
    <div className="post">
      <p>
        <b>Post #{post.id}</b> (
        {dateGapAsRelativeTimeString(post.createdAt, dateUpdatedEveryMinute)})
      </p>
      <p>
        {post.createdAt.toDateString()}, {post.createdAt.toLocaleTimeString()}
      </p>
      <p className="emoji">{post.emoji}</p>
    </div>
  );
}
