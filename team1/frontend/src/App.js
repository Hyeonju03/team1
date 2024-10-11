// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ";
// import SignUpForm from "./SignUp";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Log from "./Log";
import LogList from "./LogList"
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUpForm from './SignUp'; // 회원가입 폼 컴포넌트

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
                </Routes>
            </div>
        </Router>
    );
}

export default App;

