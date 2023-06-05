import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import TempContextProvider from "./context/TempContextProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <TempContextProvider>
            <Router>
                <App/>
            </Router>
        </TempContextProvider>
    </React.StrictMode>
);
