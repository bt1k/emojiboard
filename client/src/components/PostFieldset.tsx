import { Dispatch, SetStateAction } from 'react';
import { useFormStatus } from 'react-dom';

type PostFieldsetProps = {
  emoji: string;
  setEmoji: Dispatch<SetStateAction<string>>;
};

export default function PostFieldset({ emoji, setEmoji }: PostFieldsetProps) {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending}>
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
      <input
        disabled={emoji === ''}
        type="submit"
        value={pending ? 'Submitting...' : 'Submit'}
      />
    </fieldset>
  );
}
