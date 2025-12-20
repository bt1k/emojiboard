import { useEffect, useState } from 'react';
import PostForm from './PostForm';
import PostsList from './PostsList';

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
      // TODO: Remove simulated latency. Just for testing at the moment.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetch('http://localhost:3000/api/v1/posts');
      if (!response.ok) throw new Error('Fetching posts failed');
      const json: PostDTO[] = await response.json();
      setPosts(
        json.map((postDTO) => ({
          ...postDTO,
          createdAt: new Date(postDTO.createdAt),
        })),
      );
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
