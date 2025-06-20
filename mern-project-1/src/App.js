// App.js
import './App.css';  // This applies styles to the whole app

import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Applayout from "./layout/AppLayout";
import Dashboard from './pages/Dashboard';
import axios from "axios";

function App() {
  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (details) => {
    setUserDetails(details);
  };

  const isUserLoggedIn = async () =>{
    const response = await axios.post('http://localhost:5001/auth/is-user-logged-in',{},{
      withCredentials: true
    });
    updateUserDetails(response.data.user);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Applayout><Home /></Applayout>
          )
        }
      />
      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Applayout><Login updateUserDetails={updateUserDetails} /></Applayout>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;