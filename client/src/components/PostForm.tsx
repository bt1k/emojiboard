import { useState } from 'react';
import PostFieldset from './PostFieldset';

type PostFormProps = {
  getPosts: () => Promise<void>;
};

export default function PostForm({ getPosts }: PostFormProps) {
  const [emoji, setEmoji] = useState('');

  async function handleForm(formData: FormData) {
    try {
      // TODO: Remove simulated latency. Just for testing at the moment.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetch('http://localhost:3000/api/v1/posts', {
        body: formData,
        method: 'POST',
      });
      if (!response.ok) throw new Error('Submitting post failed');
      await getPosts();
      setEmoji('');
      alert(
        'Your emoji was submitted. Scroll down to see the submitted emojis.',
      );
    } catch {
      alert('There was an error when submitting your emoji.');
    }
  }

  return (
    <form action={handleForm}>
      <PostFieldset emoji={emoji} setEmoji={setEmoji} />
    </form>
  );
}
