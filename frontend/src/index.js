import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AppContextProvider from "./ContextAndSocket/ContextApi";
import { BrowserRouter } from "react-router-dom";
import {ToastContainer} from 'react-toastify' ;
import SocketProvider  from './ContextAndSocket/SocketContext'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <BrowserRouter>
     
    <AppContextProvider>
     <SocketProvider>
    <App />
    <ToastContainer/>
     </SocketProvider>
    </AppContextProvider>
   
    </BrowserRouter>
  
);
