import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import { useNavigate } from "react-router-dom";
import './Register.css'; // 👈 CSS for this component

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username is mandatory";
            isValid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is mandatory";
            isValid = false;
        }
        if (!formData.name.trim()) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                username: formData.username,
                password: formData.password,
                name: formData.name
            };
            const config = { withCredentials: true };

            try {
                const response = await axios.post(`${serverEndpoint}/auth/register`, body, config);
                dispatch({
                    type: SET_USER,
                    payload: response.data.user
                });
                navigate('/dashboard');
            } catch (error) {
                if (error?.response?.status === 401) {
                    setErrors({ message: 'User exists with the given email' });
                } else {
                    setErrors({ message: 'Something went wrong, please try again' });
                }
            }
        }
    };

    const handleGoogleSignin = async (authResponse) => {
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

            navigate('/dashboard');
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            setErrors({ message: 'Something went wrong while signing in with Google' });
        }
    };

    const handleGoogleSigninFailure = () => {
        setErrors({ message: 'Google Sign-In failed. Try again.' });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4 register-container">
                    <h2 className="text-center mb-4 register-heading">Sign up with a new account</h2>

                    {errors.message && (
                        <div className="alert alert-danger" role="alert">
                            {errors.message}
                        </div>
                    )}

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
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username (Email)</label>
                            <input
                                type="email"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
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
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="google-login">
                        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                            <GoogleLogin
                                onSuccess={handleGoogleSignin}
                                onError={handleGoogleSigninFailure}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
