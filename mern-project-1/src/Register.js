import React, { useState } from "react";
import axios from "axios";

function Register({ updateUserDetails }) {
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

    if (formData.name.trim() === '') {
      isValid = false;
      newErrors.name = "Name is mandatory";
    }

    if (formData.username.trim() === '') {
      isValid = false;
      newErrors.username = "Email is mandatory";
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
        name: formData.name,
        username: formData.username,
        password: formData.password
      };

      try {
        await axios.post(
          'http://localhost:5001/auth/register',
          body,
          { withCredentials: true }
        );

        setMessage("Registration successful!");
        setErrors({});
        setFormData({ name: '', username: '', password: '' });

        // Optional: auto-login or redirect
        if (updateUserDetails) {
          updateUserDetails({ name: formData.name, email: formData.username });
        }

      } catch (error) {
        console.error(error);
        setMessage(null);
        setErrors({ message: "Account already exists or server error" });
      }
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
