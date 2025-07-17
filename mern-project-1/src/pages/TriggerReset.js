import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverEndpoint } from '../config/config';
import { FiMail } from 'react-icons/fi';

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
        navigate('/');
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
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
      }}
    >
      <div 
        style={{
          textAlign: 'center',
          padding: '2.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          maxWidth: '30rem',
          margin: '0 1.5rem',
          border: '1px solid rgba(0, 0, 0, 0.05)' 
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem' 
        }}>
          <div 
            style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
            }}
          >
            <FiMail 
              style={{
                height: '3.5rem', 
                width: '3.5rem',
                color: '#212529', 
                animation: 'float 3s ease-in-out infinite' 
              }} 
            />
          </div>
        </div>
        <h2 
          style={{
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#212529',
            marginBottom: '1.25rem',
            lineHeight: '1.3'
          }}
        >
          Sending Reset Code
        </h2>
        <p 
          style={{
            fontSize: '1.125rem',
            color: '#495057',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}
        >
          We're sending a reset code to your email...
        </p>
        <div 
          style={{
            width: '100%',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            height: '6px',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              backgroundColor: '#212529',
              height: '100%',
              width: '0%',
              animation: 'progress 2.5s ease-in-out infinite'
            }}
          ></div>
        </div>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            @keyframes progress {
              0% { width: 0%; transform: translateX(0); }
              50% { width: 100%; transform: translateX(0); }
              100% { width: 100%; transform: translateX(100%); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default TriggerReset;