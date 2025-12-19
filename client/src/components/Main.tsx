import { useEffect, useState } from 'react';
import Post from './Post';

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
      await new Promise((resolve) => setTimeout(resolve, 1_000));
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <p>
        <button onClick={getPosts}>Reload</button>
      </p>
      {hasError ? (
        <p>Error!</p>
      ) : (
        <div id="postsContainer">
          <p>{posts.length} post(s) loaded.</p>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
