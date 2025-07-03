import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import Error from "./pages/Error";
import Logout from "./pages/Logout";
import { serverEndpoint } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "./redux/user/actions";
import UserLayout from "./layout/UserLayout";
import Register from "./pages/Register";
import { Spinner } from "react-bootstrap";
import ManageUsers from "./pages/users/ManageUsers";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ProtectedRoute from "./rbac/ProtectedRoute";

function App() {
  // const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/is-user-logged-in`, {}, {
        withCredentials: true
      });
      // updateUserDetails(response.data.user);
      dispatch({
        type: SET_USER,
        payload: response.data.user
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/" element={userDetails ?
        <UserLayout>
          <Navigate to='/dashboard' />
        </UserLayout> :
        <AppLayout>
          <Home />
        </AppLayout>
      }
      />
      <Route path="/login" element={userDetails ?
        <Navigate to="/dashboard" /> :
        <AppLayout>
          <Login />
        </AppLayout>}
      />
      <Route path="/register" element={userDetails ?
        <Navigate to='/dashboard' /> :
        <AppLayout>
          <Register />
        </AppLayout>
      } />
      <Route path="/dashboard" element={userDetails ?
        <UserLayout><Dashboard /></UserLayout> :
        <Navigate to="/login" />} />

      <Route path="/logout" element={userDetails ?
        <Logout /> :
        <Navigate to="/login" />} />

      <Route path="/error" element={userDetails ?
        <UserLayout>
          <Error />
        </UserLayout> :
        <AppLayout><Error /></AppLayout>} />
      <Route path="/users" element={userDetails ?
        <ProtectedRoute roles={['admin']}>
          <UserLayout>
            <ManageUsers />
          </UserLayout>
        </ProtectedRoute> :
        <Navigate to='/login' />
      } />
      <Route path="/unauthorized-access" element={userDetails ?
        <UserLayout><UnauthorizedAccess /></UserLayout> :
        <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
