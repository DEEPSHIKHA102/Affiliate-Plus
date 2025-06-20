import React, { useState } from "react";
import axios from 'axios';



function Login({updateUserDetails}) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

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

        if(formData.username.length === 0){
            isValid = false;
            newErrors.username = "Username is mandatory";
        }

        if(formData.password.length === 0){
            isValid = false;
            newErrors.password = "Password is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(validate()){
            const body = {
                username: formData.username,
                password: formData.password
            };
            const config = {
                withCredentials: true
            };

            try{
                const response = await axios.post('http://localhost:5001/auth/login',body,config);
                updateUserDetails(response.data.user);
            console.log(response);
            }catch(error){
                setErrors({message: "Something went wrong, please try again"});
            }
        }
    };



  return(
    <>
    <div className="container text-center">
        {message && (message)}
        <h1>Login page</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username: </label>
                <input type="text" name="username" value={formData.username}
                    onChange={handleChange}/>
                    {errors.username && (errors.username)}
            </div>
            <div>
                <label>Password: </label>
                <input type="text" name="password" value={formData.password}
                    onChange={handleChange}/>
                    {errors.password && (errors.password)}
            </div>
            <div>
                <button>Submit</button>
            </div>
        </form>

    </div>
    </>
  );
}

export default Login;
