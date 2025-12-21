import { useEffect, useState } from 'react';
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
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [dateUpdatedEveryMinute, setDateUpdatedEveryMinute] = useState(
    new Date(),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsElapsed((secs) => {
        // If `secondsElapsed` is 59 and it's supposed to be updated, then it's
        // supposed to be updated to 60 - or rather it is supposed to be reset
        // to 0. On a watch, the number 60 for seconds is never shown - instead
        // it just goes straight to 0.
        if (secs < 59) {
          return secs + 1;
        } else {
          setDateUpdatedEveryMinute(new Date());
          return 0;
        }
      });
    }, 1_000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <p>{posts.length} post(s) loaded (maximum: 10).</p>
      {posts.length > 0 && (
        <p>
          The age of each post is updated every minute (will update in{' '}
          <Countdown secondsElapsed={secondsElapsed} /> second(s)).
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
