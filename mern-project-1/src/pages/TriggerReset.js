// src/pages/TriggerReset.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverEndpoint } from '../config/config';

function TriggerReset() {
  const userDetails = useSelector((state) => state.userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    const sendResetToken = async () => {
      try {
        await axios.post(`${serverEndpoint}/auth/send-reset-code`, {
          email: userDetails.email,
        });
        navigate('/reset-password', { state: { email: userDetails.email } });
      } catch (err) {
        alert(
          err?.response?.data?.message || 'Failed to send reset code. Try again.'
        );
        navigate('/'); // fallback
      }
    };

    if (userDetails?.email) {
      sendResetToken();
    } else {
      alert('User email not found.');
      navigate('/');
    }
  }, [userDetails, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300">
      <div className="text-center text-lg font-medium text-gray-700">
        Sending reset code to your email...
      </div>
    </div>
  );
}

export default TriggerReset;
