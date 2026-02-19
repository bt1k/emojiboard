import { useState } from 'react';
import PostFieldset from './PostFieldset';
import { alertRateLimitInfo } from '../utils';

type PostFormProps = {
  getPosts: () => Promise<void>;
};

export default function PostForm({ getPosts }: PostFormProps) {
  const [emoji, setEmoji] = useState('');

  async function handleForm(formData: FormData) {
    try {
      const response = await fetch('/api/v1/posts', {
        body: formData,
        method: 'POST',
      });
      if (response.status === 429) {
        alertRateLimitInfo(response.headers, 'submitting posts');
        setEmoji('');
        return;
      } else if (!response.ok) {
        throw new Error('Submitting post failed');
      }
      alert(
        'Your emoji was submitted. Scroll down to see the submitted emojis.',
      );
      await getPosts();
    } catch {
      alert('There was an error when submitting your emoji.');
    }
    setEmoji('');
  }

  return (
    <form action={handleForm}>
      <PostFieldset emoji={emoji} setEmoji={setEmoji} />
    </form>
  );
}
