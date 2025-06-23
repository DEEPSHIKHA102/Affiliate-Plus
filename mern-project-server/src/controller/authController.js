const jwt = require('jsonwebtoken');
const secret = "9efe7859-8bf7-44e8-83a3-cd77b51aa6b8";

const authController = {
  login: (request, response) => {
    const { username, password } = request.body;

    if (username === 'admin' && password === 'admin') {
      const user = {
        name: 'Deepshikha Pal',
        email: '@paldeepshi'
      };

      const token = jwt.sign(user, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // set to true only when using HTTPS
        sameSite: 'Lax',
        domain: 'localhost',
        path: '/'
      });

      response.json({ user: user, message: 'User authenticated' });
    } else {
      response.status(401).json({ message: 'Invalid credentials' });
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
  }
};

module.exports = authController;
