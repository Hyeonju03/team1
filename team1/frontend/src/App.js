import Main from "./Main";
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
}

export default App;

