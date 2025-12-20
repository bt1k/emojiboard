import Main from './components/Main';
import PostForm from './components/PostForm';
import './App.css';

export default function App() {
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
          <p>
            On this website you can create a post with an emoji. Submit your own
            emoji, or have a look below at the emojis that have already been
            submitted.
          </p>
          <h2>Submit Emoji</h2>
          <PostForm />
          <h2>Submitted Emojis</h2>
          <Main />
        </main>
      </div>
    </>
  );
}
