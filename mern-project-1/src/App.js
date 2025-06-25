import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Applayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import { serverEndpoint } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "./redux/user/actions";

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/is-user-logged-in`,
          {},
          { withCredentials: true }
        );
        dispatch({
          type: SET_USER,
          payload: response.data.user,
        });
      } catch (error) {
        console.log("User not logged in:", error);
      }
    };

    checkLogin();
  }, [dispatch]);

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
              <Login />
            </Applayout>
          )
        }
      />
      <Route
        path="/register"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Applayout>
              <Register />
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
        element={userDetails ? <Logout /> : <Navigate to="/login" />}
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
