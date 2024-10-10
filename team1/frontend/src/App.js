import logo from './logo.svg';
import './App.css';
import Main from "./Main";
import MailList from "./MailList";
import MailDetail from "./MailDetail";
import MailSend from "./MailSend";
import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TrashPage from './TrashPage';
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import DocumentRegister from "./DocumentRegister";

function App() {
    const [emails, setEmails] = useState([
        { id: 1, sender: "김철수", subject: "회의 일정 안내", date: "10.07 14:41" },
        { id: 2, sender: "이영희", subject: "프로젝트 보고서", date: "10.07 11:23" },
        { id: 3, sender: "박지성", subject: "휴가 신청 승인", date: "10.06 17:55" },
        { id: 4, sender: "정민우", subject: "신제품 출시 안내", date: "10.06 09:30" }
    ]);  // 초기 이메일 리스트 상태

    const [trash, setTrash] = useState([]);

    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* 받은 메일함 리스트 */}
                    <Route
                        path="/"
                        element={<MailList emails={emails} setEmails={setEmails} trash={trash} setTrash={setTrash}/>}
                    />
                    {/* 메일 상세 페이지 */}
                    <Route path="/mail/:id" element={<MailDetail/>}/>
                    {/* 답장 메일 작성 화면 */}
                    <Route path="/mail/send" element={<MailSend/>}/>
                    {/* 휴지통 페이지 */}
                    <Route path="/trash" element={<TrashPage trash={trash}/>}/>
                    {/* 문서함 리스트 */}
                    <Route path="/document" element={<DocumentList/>}/>
                    {/*/!* 문서함 상세 *!/*/}
                    {/*<Route path="/document/detail" element={<DocumentDetail/>}/>*/}
                    {/* 메일 상세 페이지 */}
                    <Route path="/document/detail/:id" element={<DocumentDetail/>}/>
                    {/* 문서함 등록 */}
                    <Route path="/document/register" element={<DocumentRegister/>}/>
                </Routes>
            </Router>

        </div>
    );
}

export default App;
