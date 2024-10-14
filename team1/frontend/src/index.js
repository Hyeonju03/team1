import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App /> {/* BrowserRouter는 App.js에서 이미 감싸므로 여기서는 제거 */}
    </React.StrictMode>
);

reportWebVitals();
