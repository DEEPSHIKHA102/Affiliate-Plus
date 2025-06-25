import React, { useState } from "react";
import axios from "axios";
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import { serverEndpoint } from "./config";
import { useDispatch } from "react-redux";
import { SET_USER } from "./redux/user/actions";

function Login() {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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

    if (formData.username.trim() === '') {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }

    if (formData.password.trim() === '') {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const body = {
        username: formData.username,
        password: formData.password
      };
      const config = {
        //Tells axios to include cookie in the rquest + some other auth headers
        withCredentials: true
      };
      try {
        const response = await axios.post(`${serverEndpoint}/auth/login`,body,config);
        dispatch({
          type: SET_USER,
          payload: response.data.user
        });
      } catch (error) {
        console.error(error);
        setErrors({ message: "Invalid credentials or server error" });
      }
    }

  };
  const handleGoogleSuccess = async (authResponse) => {
    try{
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`,{
        idToken: authResponse.credential
      },{
        withCredentials:true
      });
      dispatch({
          type: SET_USER,
          payload: response.data.user
        });

    }catch(error){
      console.log(error);
    setErrors({message: 'Error processing in google auth, pls try again'});

    }

  };

  const handleGoogleError = async (error)=>{
    console.log(error);
    setErrors({message: 'Error in google authorization flow, pls try again'});
  }

  return (
    <div>
      <h1>Login Page</h1>
      {message && <p>{message}</p>}
      {errors.message && <p style={{ color: 'red' }}>{errors.message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      <h2>OR</h2>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Login;
