import logo from './logo.svg';
import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ"
import SignUpForm from "./SignUp";
import AdminFAQ from "./AdminFAQ"
import AdminQDetail from "./AdminQDetail"
import Log from "./Log"

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
      {/*  <SignUpForm/>*/}
      {/*  <AdminQ/>*/}
      {/*  <AdminQDetail/>*/}
        <Log/>
    </div>
  );
}

export default App;
