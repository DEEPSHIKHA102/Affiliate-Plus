// App.js
import "./App.css"; // This applies styles to the whole app

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Applayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import Logout from "./pages/Logout";
import Error from "./pages/Error";

function App() {
  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (details) => {
    setUserDetails(details);
  };

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/auth/is-user-logged-in",
        {},
        {
          withCredentials: true,
        }
      );
      updateUserDetails(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Applayout>
              <Home />
            </Applayout>
          )
        }
      />
      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Applayout>
              <Login updateUserDetails={updateUserDetails} />
            </Applayout>
          )
        }
      />
      <Route
        path="/dashboard"
        element={userDetails ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/logout"
        element={
          userDetails ? (
            <Logout updateUserDetails={updateUserDetails} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/error"
        element={
          userDetails ? (
            <Error />
          ) : (
            <Applayout>
              <Error />
            </Applayout>
          )
        }
      />
    </Routes>
  );
}

export default App;
