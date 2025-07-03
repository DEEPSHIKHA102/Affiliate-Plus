const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');

const secret = process.env.JWT_SECRET;

const authController = {
  // ✅ Email + Password Login
  login: async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() });
      }

      const { username, password } = request.body;

      const user = await Users.findOne({ email: username });
      if (!user) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      const userPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin',
        adminId: user.adminId,
        credits: user.credits || 0
      };

      const token = jwt.sign(userPayload, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // set to true only if using HTTPS
        sameSite: 'Lax',
        path: '/'
      });

      response.json({ user: userPayload, message: 'User authenticated' });
    } catch (error) {
      console.error("Login error:", error.message);
      response.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ Logout
  logout: (request, response) => {
    response.clearCookie('jwtToken', { path: '/' });
    response.json({ message: 'Logout successful' });
  },

  // ✅ Session Check
  isUserLoggedIn: async (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, secret, async (error, user) => {
      if (error) {
        return response.status(401).json({ message: 'Unauthorized access' });
      } else {
        const latestUserDetails = await Users.findById(user.id);
        response.json({ message: 'User is logged in', user: latestUserDetails });
      }
    });
  },

  // ✅ Register New User
  register: async (request, response) => {
    try {
      const { username, password, name } = request.body;

      if (!password || password.length < 3) {
        return response.status(400).json({ message: 'Password must be at least 3 characters long' });
      }

      const existingUser = await Users.findOne({ email: username });
      if (existingUser) {
        return response.status(401).json({ message: 'Account already exists with given email' });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = new Users({
        email: username,
        password: encryptedPassword,
        name: name,
        role: 'admin'
      });

      await user.save();

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits || 0
      };

      const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/'
      });

      response.json({ message: 'User registered', user: userDetails });
    } catch (error) {
      console.error("Register error:", error.message);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // ✅ Google Auth
  googleAuth: async (request, response) => {
    try {
      const { idToken } = request.body;

      if (!idToken) {
        return response.status(401).json({ message: 'Invalid request' });
      }

      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { sub: googleId, name, email } = payload;

      let user = await Users.findOne({ email });

      if (!user) {
        user = new Users({
          email,
          name,
          googleId,
          isGoogleUser: true,
          role: 'admin'
        });
        await user.save();
      }

      const userPayload = {
        id: user._id,
        username: user.email,
        name: user.name,
        role: user.role || 'admin',
        credits: user.credits || 0
      };

      const token = jwt.sign(userPayload, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/'
      });

      response.json({ user: userPayload, message: 'User authenticated' });
    } catch (error) {
      console.error("Google Auth Error:", error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
