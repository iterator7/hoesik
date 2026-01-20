import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MeetingProvider } from './context/MeetingContext';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MeetingProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MeetingProvider>
    </React.StrictMode>
);
