import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Notice from "./Notice";
import Log from "./Log";
import LogList from "./LogList"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignUpForm from './SignUp';
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import DocumentRegister from "./DocumentRegister";
import ApplyForBusiness from "./ApplyForBusiness";
import Schedule from "./Schedule";
import SignList from "./SignList";
import SignRequest from "./SignRequest";
import UserInfo from "./UserInfo";
import UserInfoModifyRequest from "./UserInfoModifyRequest";
import DocumentUpdate from "./DocumentUpdate";
import AdminOneToOneDetail from "./AdminOneToOneDetail"
import MailList from "./MailList";
import MailSend from "./MailSend";
import MailSendList from "./MailSendList";
import MailSendResult from "./MailSendResult";
import MailDetail from "./MailDetail";
import ToMeMailSend from "./ToMeMailSend";
import MailTrashList from "./MailTrashList";
import ToMeMailSendList from "./ToMeMailSendList";
import AttachMentMailList from "./AttachMentMailList";
import ToTalMailSendList from "./ToTalMailSendList";
import ReceivedMailList from "./ReceivedMailList";

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

                    <Route path="/documents" element={<DocumentList/>}/>
                    <Route path="/documents/:id" element={<DocumentDetail/>}/>
                      
                    <Route path="/document/register" element={<DocumentRegister/>}/>
                    <Route path="/documents/update/:id" element={<DocumentUpdate/>}/>

                    <Route path="/notices" element={<Notice/>}/>
                    <Route path="/apply" element={<ApplyForBusiness/>}/>

                    <Route path="/schedule" element={<Schedule/>}/>

                    <Route path="/sign" element={<SignList/>}/>
                    <Route path="/sign/register" element={<SignRequest/>}/>

                    <Route path="/userInfo" element={<UserInfo/>}/>
                    <Route path="/UserInfoModifyRequest" element={<UserInfoModifyRequest/>}/>

                    <Route path="/ApplyForBusiness" element={<ApplyForBusiness/>}/>

                    <Route path="/MailList" element={<MailList/>}/>
                    <Route path="/MailSend" element={<MailSend/>}/>
                    <Route path="/MailSendList" element={<MailSendList/>}/>
                    <Route path="/MailSendResult" element={<MailSendResult/>}/>
                    <Route path="/MailDetail" element={<MailDetail/>}/>
                    <Route path="/ToMeMailSend" element={<ToMeMailSend/>}/>
                    <Route path="/MailTrashList" element={<MailTrashList/>}/>
                    <Route path="/ToMeMailSendList" element={<ToMeMailSendList/>}/>
                    <Route path="/AttachMentMailList" element={<AttachMentMailList/>}/>
                    <Route path="/ToTalMAilSendList" element={<ToTalMailSendList/>}/>
                    <Route path="/ReceivedMailList" element={<ReceivedMailList/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;

