const { response, request } = require('express');
const jwt = require('jsonwebtoken');

//https://www.uuidgenerator.net/
const secret = "9efe7859-8bf7-44e8-83a3-cd77b51aa6b8";

const authController = {
    login: (request, response) => {

        //The body contains username and password becoz of the express.json()
        //middleware configured in the server.js


        const {username, password} = request.body;
        if(username === 'admin' && password === 'admin'){
            const user = {
                name: 'Deepshikha pal',
                email: '@paldeepshi'
            };

            const token = jwt.sign(user, secret, {expiresIn: '1h'});
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({user: user, message: 'User authenticated'});
        }else{
            response.status(401).json({message : 'Invalid credentials'})
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({message: 'Logout successfull'});
    },
    isUserLoggedIn: (request, response) =>{
        const Token = request.cookies.jwtToken;

        if(!Token){
            return response.status(401).json({message: 'Unauthoriized access'});
        }

        jwt.verify(Token,secret,(error,user)=>{
            if(error){
                return response.status(401).json({message: 'Unauthorized access'});
            }else{
                response.json({message: 'User is looged in', user:user});
            }

        });

    },
};

module.exports = authController;