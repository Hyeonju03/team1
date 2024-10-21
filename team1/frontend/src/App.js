import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Notice from "./Notice";
import Log from "./Log";
import LogList from "./LogList"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUpForm from './SignUp';
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import DocumentRegister from "./DocumentRegister";
import ApplyForBusiness from "./ApplyForBusiness";
import Schedule from "./Schedule";
import SignList from "./SignList";
import SignRequest from "./SignRequest";
import UserInfo from "./UserInfo";
import AdminOneToOneDetail from "./AdminOneToOneDetail"
import MailList from "./MailList";
import MailSend from "./MailSend";
import MailSendList from "./MailSendList";

function App() {
    return (
        <Router>
            <div className="App">

                <Routes>
                    <Route path="/main" element={<Main/>}></Route>
                    <Route path="/SignUp" element={<SignUpForm/>}/>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/AdminQ" element={<AdminQ/>}/>

                    <Route path="/AdminFAQ" element={<AdminFAQ/>}/>
                    <Route path="/AdminQDetail" element={<AdminQDetail/>}/>
                    <Route path="/AdminOneToOneDetail" element={<AdminOneToOneDetail/>}/>
                    <Route path="/Log" element={<Log/>}/>
                    <Route path="/LogList" element={<LogList/>}/>
                      
                    <Route path="/document" element={<DocumentList/>}/>
                    <Route path="/document/detail/:id" element={<DocumentDetail/>}/>
                    <Route path="/document/register" element={<DocumentRegister/>}/>

                    <Route path="/notices" element={<Notice />} />
                    <Route path="/apply" element={<ApplyForBusiness />} />

                    <Route path="/schedule" element={<Schedule />} />

                    <Route path="/sign" element={<SignList />} />
                    <Route path="/sign/register" element={<SignRequest />} />
                    <Route path="/userInfo" element={<UserInfo/>} />

                    <Route path="/ApplyForBusiness" element={<ApplyForBusiness/>}/>

                    <Route path="/MailList" element={<MailList/>}/>
                    <Route path="/MailSend" element={<MailSend/>}/>
                    <Route path="/MailSendList" element={<MailSendList/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;

