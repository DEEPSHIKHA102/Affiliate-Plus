import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { SET_USER } from "../redux/user/actions";
import { serverEndpoint } from "../config/config";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.username.trim()) {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }

    if (!formData.password.trim()) {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(`${serverEndpoint}/auth/login`, {
          username: formData.username,
          password: formData.password
        }, {
          withCredentials: true
        });

        dispatch({
          type: SET_USER,
          payload: response.data.user
        });

        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        const backendMessage = error?.response?.data?.message;

        if (backendMessage === "Use Google login") {
          setErrors({ message: "This account is linked with Google. Please use Google login." });
        } else if (backendMessage === "Invalid credentials ") {
          setErrors({ message: "Invalid credentials, please try again." });
        } else {
          setErrors({ message: "Login failed. Please try again." });
        }
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, {
        withCredentials: true
      });

      dispatch({
        type: SET_USER,
        payload: response.data.user
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setErrors({ message: "Google account not registered. Please contact support or register manually." });
      } else {
        setErrors({ message: "Something went wrong with Google login." });
      }
    }
  };

  const handleGoogleError = (error) => {
    console.log("Google OAuth Error", error);
    setErrors({ message: 'Google authorization failed, please try again' });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 login-container">
          <h2 className="text-center mb-4 login-heading">Sign in to Continue</h2>

          {errors.message && (
            <div className="alert alert-danger" role="alert">
              {errors.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="d-grid mb-2">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>

            <div className="text-center mb-3">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="divider text-center my-3">OR</div>

          <div className="google-login text-center">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
