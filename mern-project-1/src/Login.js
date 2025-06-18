import React, { useState } from "react";
import './Login.css';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const valuser = 'deepshikha';
  const valpass = '1234';
  const valemail = 'paldeepshikha102@gmail.com';

  const handleLogin = () => {
    if (username === valuser && password === valpass && email === valemail) {
      setMessage("Login successfully!");
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
  <div className="login-container">
    <h2>Login Form</h2>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    /><br />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    /><br />
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    /><br />
    <button onClick={handleLogin}>Login</button>
    <p>{message}</p>
  </div>
);

}

export default Login;
