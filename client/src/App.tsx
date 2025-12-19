import { useEffect, useState } from 'react';
import './App.css';

export function App() {
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

  return (
    <>
      <header id="appHeader">
        <nav id="appNav">
          <span>
            <b>EmojiBoard</b>
          </span>
        </nav>
      </header>
      <div id="appContainer">
        <main id="appMain">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>
                <button onClick={getPosts}>Reload</button>
              </p>
              {hasError ? (
                <>
                  <p>Error!</p>
                </>
              ) : (
                <>
                  <p>{posts.length} post(s) loaded.</p>
                  <ol>
                    {posts.map((post) => (
                      <li key={post.id}>{JSON.stringify(post)}</li>
                    ))}
                  </ol>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
