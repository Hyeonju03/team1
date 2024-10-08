import logo from './logo.svg';
import './App.css';
import Main from "./Main";
import MailList from "./MailList";
import MailDetail from "./MailDetail";
import MailSend from "./MailSend";
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* 받은 메일함 리스트 */}
                    <Route path="/" element={<MailList/>}/>
                    <Route path="/mail/:id" element={<MailDetail/>}/> {/* 메일 ID에 따라 상세 페이지로 이동 */}
                    {/* 답장 메일 작성 화면 */}
                    <Route path="/mail/send" element={<MailSend />} />
                </Routes>

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
                {/*<MailList/>*/}
                {/*<MailDetail/>*/}
                {/*<MailSend/>*/}
            </Router>
        </div>

    );
}

export default App;
