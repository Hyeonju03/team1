import "./App.css";
import Main from "./Main";
import AdminQ from "./AdminQ";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";

import Log from "./Log";
import LogList from "./LogList";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUpForm from "./SignUp";
import DocumentList from "./DocumentList";

import DocumentDetail from "./DocumentDetail";
import DocumentRegister from "./DocumentRegister";
import ApplyForBusiness from "./ApplyForBusiness";
import Schedule from "./Schedule";
import SignList from "./SignList";
import SignRegister from "./SignRegister";
import UserInfo from "./UserInfo";
import UserInfoModifyRequest from "./UserInfoModifyRequest";
import DocumentUpdate from "./DocumentUpdate";
import AdminOneToOneDetail from "./AdminOneToOneDetail";
import SignDetail from "./SignDetail";
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
import Authority from "./Authority";
import CompanyInfo from "./CompanyInfo";
import PaymentCom from "./PaymentCom";
import DepartmentManagement from "./DepartmentManagement";
import PositionManagement from "./PositionManagement";
import {AuthProvider} from "./noticeAuth";
import AdminNoticeList from "./AdminNoticeList";
import UserNoticeList from "./UserNoticeList";
import AdminNoticeDetail from "./AdminNoticeDetail";
import AdminNoticeRegister from "./AdminNoticeRegister";
import UserNoticeDetail from "./UserNoticeDetail";
import {ListLibraryProvider} from "./Context/ListLibraryContext";
import AnsQ from "./AnsQ";
import AnsQDetail from "./AnsQDetail";
import AnsQCompleteList from "./AnsQCompleteList";
import NoAnsQList from "./NoAnsQList";
import UserInfoModifyRequestList from "./UserInfoModifyRequestList";
import {UserProvider} from "./UserContext";

function App() {
    return (
        <ListLibraryProvider>
            <AuthProvider>
                <UserProvider>
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

                                <Route path="/AnsQ" element={<AnsQ/>}/>
                                <Route path="/AnsQDetail" element={<AnsQDetail/>}/>
                                <Route path="/AnsQCompleteList" element={<AnsQCompleteList/>}/>
                                <Route path="/NoAnsQList" element={<NoAnsQList/>}/>

                                <Route path="/Log" element={<Log/>}/>
                                <Route path="/LogList" element={<LogList/>}/>

                                <Route path="/documents" element={<DocumentList/>}/>
                                <Route path="/documents/:id" element={<DocumentDetail/>}/>
                                <Route path="/document/register" element={<DocumentRegister/>}/>
                                <Route path="/documents/update/:id" element={<DocumentUpdate/>}/>

                                <Route path="/schedule" element={<Schedule/>}/>
                                <Route path="/sign" element={<SignList/>}/>
                                <Route path="/sign/detail/:id" element={<SignDetail/>}/>
                                <Route path="/sign/register" element={<SignRegister/>}/>

                                <Route path="/admin/notice/list" element={<AdminNoticeList/>}/>
                                <Route path="/admin/notice/register" element={<AdminNoticeRegister/>}/>
                                <Route path="/admin/notice/detail" element={<AdminNoticeDetail/>}/>

                                <Route path="/user/notice/list" element={<UserNoticeList/>}/>
                                <Route path="/user/notice/detail" element={<UserNoticeDetail/>}/>

                                <Route path="/userInfo" element={<UserInfo/>}/>
                                <Route path="/UserInfoModifyRequest" element={<UserInfoModifyRequest/>}/>

                                <Route path="/UserInfoRequestList" element={<UserInfoModifyRequestList/>}/>

                                <Route path="/Authority" element={<Authority/>}/>

                                <Route path="/CompanyInfo" element={<CompanyInfo/>}/>
                                <Route path="/PaymentCom" element={<PaymentCom/>}/>
                                <Route path="/ApplyForBusiness" element={<ApplyForBusiness/>}/>

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

                                <Route path="/DepartmentManagement" element={<DepartmentManagement/>}/>
                                <Route path="/PositionManagement" element={<PositionManagement/>}/>
                            </Routes>
                        </div>
                    </Router>
                </UserProvider>
            </AuthProvider>
        </ListLibraryProvider>
    );
}

export default App;
