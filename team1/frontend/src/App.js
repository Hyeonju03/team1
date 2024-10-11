// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ";
// import SignUpForm from "./SignUp";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Log from "./Log";
import LogList from "./LogList"
//
// // function App() {
// //     return (
// //         <Router>
// //             <div className="App">
// //                 <Routes>
// //                     <Route path="/" element={<Main />} />
// //                     <Route path="/AdminQ" element={<AdminQ />} />
// //                     <Route path="/SignUp" element={<SignUpForm />} />
// //                     <Route path="/AdminFAQ" element={<AdminFAQ />} />
// //                     <Route path="/AdminQDetail" element={<AdminQDetail />} />
// //                     <Route path="/Log" element={<Log />} />
// //                 </Routes>
// //             </div>
// //         </Router>
// //     );
// // }
// //
// // export default App;
//
// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
//
// function App() {
//     const [hello, setHello] = useState('')
//
//     useEffect(() => {
//         axios.get('http://localhost:8080/api/SingUp')
//             .then(response => setHello(response.data))
//             .catch(error => console.log(error))
//     }, []);
//
//     return (
//         // <div>
//         //     백엔드에서 가져온 데이터입니다 : {hello}
//         // </div>
//         <Router>
//             <div className="App">
//                 <Routes>
//                     {/*<Route path="/" element={<Main/>}/>*/}
//                     {/*<Route path="/AdminQ" element={<AdminQ/>}/>*/}
//                     <Route path="/SignUp" element={<SignUpForm/>}/>
//                     {/*<Route path="/AdminFAQ" element={<AdminFAQ/>}/>*/}
//                     {/*<Route path="/AdminQDetail" element={<AdminQDetail/>}/>*/}
//                     {/*<Route path="/Log" element={<Log/>}/>*/}
//                 </Routes>
//             </div>
//         </Router>
//     );
// }
//
// export default App;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUpForm from './SignUp'; // 회원가입 폼 컴포넌트

function App() {
    const [hello, setHello] = useState('');

    useEffect(() => {
        axios.post('http://localhost:8080/api/SignUp') // POST 요청으로 변경
            .then(response => setHello(response.data.message))
            .catch(error => console.log(error));
    }, []);

    return (
        <Router>
            <div className="App">
                <h1>{hello}</h1> {/* 가입 성공 메시지 출력 */}
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

