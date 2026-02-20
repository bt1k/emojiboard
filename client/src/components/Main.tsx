import { useEffect, useState } from 'react';
import PostForm from './PostForm';
import PostsList from './PostsList';
import { alertRateLimitInfo } from '../utils';

export default function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    setIsLoading(true);
    setHasError(false);
    setPosts([]);
    try {
      const response = await fetch('/api/v1/posts');
      if (response.status === 429) {
        alertRateLimitInfo(response.headers, 'loading posts');
        throw new Error('Fetching posts too often');
      } else if (!response.ok) {
        throw new Error('Fetching posts failed');
      }
      const json: PostDTO[] | null = await response.json();
      if (json) {
        setPosts(
          json.map((postDTO) => ({
            ...postDTO,
            createdAt: new Date(postDTO.createdAt),
          })),
        );
      } else {
        setPosts([]);
      }
    } catch {
      setHasError(true);
    }
    setIsLoading(false);
  }

  return (
    <>
      <h2>Welcome</h2>
      <p>
        On this website you can create a post with an emoji. Submit your own
        emoji, or have a look below at the emojis that have already been
        submitted.
      </p>
      <h2>Submit Emoji</h2>
      <PostForm getPosts={getPosts} />
      <h2>Submitted Emojis</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <PostsList getPosts={getPosts} hasError={hasError} posts={posts} />
      )}
    </>
  );
}
