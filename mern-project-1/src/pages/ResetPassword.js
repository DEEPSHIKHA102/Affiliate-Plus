import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { serverEndpoint } from '../config/config';

function ResetPassword() {
  const location = useLocation();
  const emailFromState = location?.state?.email;

  const [email, setEmail] = useState(emailFromState || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverEndpoint}/auth/verify-reset-code`, {
        email,
        code,
        newPassword,
      });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Reset failed. Try again.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', marginTop: '-50px' }}
    >
      <div
        className="border p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white' }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleReset}>
          {!emailFromState && (
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Verification Code</label>
            <input
              type="text"
              className="form-control"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>
        {message && <p className="mt-3 text-center text-muted">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
