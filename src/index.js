import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {Provider}  from "react-redux";
import { store } from './redux/store/store';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <GoogleOAuthProvider clientId="504905620157-fn6s1thmb67mb1ip67bd5qnbd1givfs3.apps.googleusercontent.com">

  <React.StrictMode>
      <App />
  </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
