import logo from './logo.svg';
import './App.css';
import Main from "./Main";
import AdminFAQ from "./AdminFAQ";
import SignUpForm from "./SignUp";
import AdminQ from "./AdminQ";

function App() {
  return (
    <div className="App">
      {/*<header className="App-header">*/}
      {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.js</code> and save to reload.*/}
      {/*  </p>*/}
      {/*  <a*/}
      {/*    className="App-link"*/}
      {/*    href="https://reactjs.org"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Learn React*/}
      {/*  </a>*/}
      {/*</header>*/}
      {/*<Main/>*/}
      {/*  <AdminFAQ/>*/}
      {/*<SignUpForm/>*/}
        <AdminQ/>
    </div>
  );
}

export default App;
