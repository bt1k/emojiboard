import Main from './components/Main';
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
          <Main />
        </main>
      </div>
    </>
  );
}
