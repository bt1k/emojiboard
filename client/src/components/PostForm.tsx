import { useState } from 'react';

export default function PostForm() {
  const [emoji, setEmoji] = useState('');

  function handleForm() {
    alert(`You submitted "${emoji}"!`);
  }

  return (
    <form action={handleForm}>
      <select
        name="emoji"
        onChange={(event) => setEmoji(event.target.value)}
        value={emoji}
      >
        <option value="">Choose emoji &darr;</option>
        <option value="🙂">🙂 (Smile)</option>
        <option value="🙁">🙁 (Frown)</option>
        <option value="😐">😐 (Neutral)</option>
        <option value="😂">😂 (Crying with laughter)</option>
        <option value="😡">😡 (Angry)</option>
      </select>
      <input disabled={emoji === ''} type="submit" value="Submit" />
    </form>
  );
}
