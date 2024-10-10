import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Main from "./Main";
import AdminQ from "./AdminQ";
import SignUpForm from "./SignUp";
import AdminFAQ from "./AdminFAQ";
import AdminQDetail from "./AdminQDetail";
import Log from "./Log";

// function App() {
//     return (
//         <Router>
//             <div className="App">
//                 <Routes>
//                     <Route path="/" element={<Main />} />
//                     <Route path="/AdminQ" element={<AdminQ />} />
//                     <Route path="/SignUp" element={<SignUpForm />} />
//                     <Route path="/AdminFAQ" element={<AdminFAQ />} />
//                     <Route path="/AdminQDetail" element={<AdminQDetail />} />
//                     <Route path="/Log" element={<Log />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// }
//
// export default App;

import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [hello, setHello] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/api/hello')
            .then(response => setHello(response.data))
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            백엔드에서 가져온 데이터입니다 : {hello}
        </div>
        // <Router>
        //     <div className="App">
        //         <Routes>
        //             <Route path="/" element={<Main/>}/>
        //             <Route path="/AdminQ" element={<AdminQ/>}/>
        //             <Route path="/SignUp" element={<SignUpForm/>}/>
        //             <Route path="/AdminFAQ" element={<AdminFAQ/>}/>
        //             <Route path="/AdminQDetail" element={<AdminQDetail/>}/>
        //             <Route path="/Log" element={<Log/>}/>
        //         </Routes>
        //     </div>
        // </Router>
    );
}

export default App;

