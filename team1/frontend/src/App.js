import './App.css';
import Main from "./Main";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/main" element={<Main/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
