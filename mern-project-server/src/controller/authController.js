const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');
const { response } = require('express');

const secret = "9efe7859-8bf7-44e8-83a3-cd77b51aa6b8";

const authController = {
  login: async (request, response) => {
    try {
      // The body contains username and password because of express.json() middleware
      const { username, password } = request.body;

      // Fetch user by email
      const data = await Users.findOne({ email: username });
        // console.log(data);
      if (!data) {
        return response.status(401).json({ message: 'Invalid Credentials' });
      }

      // Compare entered password with hashed password in DB
      const isMatch = await bcrypt.compare(password, data.password);

      if (!isMatch) {
        return response.status(401).json({ message: 'Invalid Credentials' });
      }

      const user = {
        id: data._id,
        name: data.name,
        email: data.email
      };

      const token = jwt.sign(user, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // Set true for HTTPS
        sameSite: 'Lax',
        domain: 'localhost',
        path: '/'
      });

      response.json({ user: user, message: 'User authenticated' });

    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (request, response) => {
    response.clearCookie('jwtToken');
    response.json({ message: 'Logout successful' });
  },

  isUserLoggedIn: (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, secret, (error, user) => {
      if (error) {
        return response.status(401).json({ message: 'Unauthorized access' });
      } else {
        response.json({ message: 'User is logged in', user: user });
      }
    });
  },
  register:async(request,response)=>{
    try{
      //Extact attributes from the request body
      const {username,password,name} = request.body;

      //firstly check if user already exist with the given email
      const data = await Users.findOne({email:username});
      if(data){
       return response.status(401).json({ message: 'Account already exist with given email' });
      }

      //Encrypt the pasword before saving the record to the database
      const encryptedPassword = await bcrypt.hash(password,10);

      //Create mongoose model object and set the record  values
      const user = new Users({
        email: username,
        password: encryptedPassword,
        name:name
      });
      await user.save();
      response.status(200).json({ message: 'UserRegister' });
    }catch(error){
      console.log(error);
      return response.status(500).json({ error: 'internal server error' });
    }
  },

  

googleAuth: async (request, response) => {
  try {
    const { idToken } = request.body;

    if (!idToken) {
      return response.status(401).json({ message: 'Invalid request' });
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const googleResponse = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = googleResponse.getPayload();
    const { sub: googleId, name, email } = payload;

    let data = await Users.findOne({ email: email });

    // If user doesn't exist, create a new one
    if (!data) {
      data = new Users({
        email: email,
        name: name,
        isGoogleUser: true,
        googleId: googleId
      });
      await data.save();
    }

    const user = {
      id: data._id ? data._id : googleId,
      username: email,
      name: name
    };

    const token = jwt.sign(user, secret, { expiresIn: '1h' });

    response.cookie('jwtToken', token, {
      httpOnly: true,
      secure: true, // Set false for localhost testing
      domain: 'localhost',
      path: '/'
    });

    response.json({ user: user, message: 'User authenticated' });

  } catch (error) {
    console.error('Google Auth Error:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}


  
};

module.exports = authController;
