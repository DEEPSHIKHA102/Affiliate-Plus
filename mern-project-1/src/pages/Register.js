import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import { serverEndpoint } from "../config/config";

function Register() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      isValid = false;
      newErrors.name = "Name is mandatory";
    }
    if (!formData.username.trim()) {
      isValid = false;
      newErrors.username = "Email is mandatory";
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

    if (!validate()) return;

    const body = {
      name: formData.name,
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await axios.post(`${serverEndpoint}/auth/register`, body, {
        withCredentials: true
      });

      dispatch({
        type: SET_USER,
        payload: response.data.user
      });

      setMessage("Registration successful!");
      setErrors({});
      setFormData({ name: '', username: '', password: '' });

    } catch (error) {
      console.error(error);
      setMessage(null);
      if (error?.response?.status === 401) {
        setErrors({ message: "Account already exists" });
      } else {
        setErrors({ message: "Server error. Please try again." });
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
    } catch (error) {
      console.error(error);
      setErrors({ message: "Error with Google Sign-In" });
    }
  };

  const handleGoogleError = () => {
    setErrors({ message: "Google authorization failed. Try again." });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Create an Account</h2>

          {message && <div className="alert alert-success">{message}</div>}
          {errors.message && <div className="alert alert-danger">{errors.message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
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
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
          </form>

          <div className="text-center">
            <div className="my-4 d-flex align-items-center text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>

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

export default Register;
