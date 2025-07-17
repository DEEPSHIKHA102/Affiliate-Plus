import React, { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/config';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-code`, { email });
      setMessage('Reset code sent successfully. Redirecting...');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', marginTop: '-50px' }} // move slightly up
    >
      <div
        className="border p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white' }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSendCode}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Reset Code</button>
        </form>
        {message && <p className="mt-3 text-center text-muted">{message}</p>}
      </div>
    </div>
  );
}

export default ForgetPassword;
