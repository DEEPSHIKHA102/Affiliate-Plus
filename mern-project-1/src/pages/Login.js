import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import './Login.css'; // 👈 Custom styles

function Login() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

        if (formData.username.length === 0) {
            isValid = false;
            newErrors.username = "Username is mandatory";
        }

        if (formData.password.length === 0) {
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
                withCredentials: true
            };
            try {
                const response = await axios.post(`${serverEndpoint}/auth/login`, body, config);
                dispatch({
                    type: SET_USER,
                    payload: response.data.user
                });
            } catch (error) {
                console.log(error);
                setErrors({ message: "Something went wrong, please try again" });
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
            console.log(error);
            setErrors({ message: 'Error processing Google auth, please try again' });
        }
    };

    const handleGoogleError = async (error) => {
        console.log(error);
        setErrors({ message: 'Error in Google authorization flow, please try again' });
    }

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

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="google-login">
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
