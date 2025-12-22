import { useState } from 'react';
import Countdown from './Countdown';
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
  const [dateUpdatedEveryMinute, setDateUpdatedEveryMinute] = useState(
    new Date(),
  );

  return (
    <>
      <p>{posts.length} post(s) loaded (maximum: 10).</p>
      {posts.length > 0 && (
        <p>
          The age of each post is updated every minute (will update in{' '}
          <Countdown setDateUpdatedEveryMinute={setDateUpdatedEveryMinute} />{' '}
          second(s)).
        </p>
      )}
      <p>
        <button onClick={getPosts}>Reload</button>
      </p>
      {hasError ? (
        <p className="error">There was an error when loading posts.</p>
      ) : (
        <div id="postsContainer">
          {posts.map((post) => (
            <Post
              key={post.id}
              dateUpdatedEveryMinute={dateUpdatedEveryMinute}
              post={post}
            />
          ))}
        </div>
      )}
    </>
  );
}
