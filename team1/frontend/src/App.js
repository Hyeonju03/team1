import Main from "./Main";
<<<<<<< HEAD
import AdminQ from "./AdminQ";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Log from "./Log";
import LogList from "./LogList"
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUpForm from './SignUp';
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import DocumentRegister from "./DocumentRegister";

function App() {
    return (
        <Router>
            <div className="App">

                <Routes>
                    <Route path="/SignUp" element={<SignUpForm/>}/>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/AdminQ" element={<AdminQ/>}/>

                    <Route path="/AdminFAQ" element={<AdminFAQ/>}/>
                    <Route path="/AdminQDetail" element={<AdminQDetail/>}/>
                    <Route path="/Log" element={<Log/>}/>
                    <Route path="/LogList" element={<LogList/>}/>
                      
                    <Route path="/document" element={<DocumentList/>}/>
                    <Route path="/document/detail/:id" element={<DocumentDetail/>}/>
                    <Route path="/document/register" element={<DocumentRegister/>}/>
                </Routes>
            </div>
        </Router>
    );
=======
import Notice from "./Notice";
import ApplyForBusiness from "./ApplyForBusiness";


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
      <ApplyForBusiness/>
      {/*<Notice/>*/}

    </div>
  );
>>>>>>> origin/cyw
}

export default App;

