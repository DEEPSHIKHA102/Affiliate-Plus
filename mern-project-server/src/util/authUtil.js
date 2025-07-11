const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const secret = process.env.JWT_SECRET;

const attemptToRefreshToken = async (refreshToken) => {
    try{
        console.log(refreshToken);
        console.log(refreshSecret);
        const decoded = jwt.verify(refreshToken, refreshSecret);

        //fecth the latest user data from db as across 7 days of
        //refreshToken lifecycle, user details like credits, subscriptions
        // can change
        const data = await Users.findById({ _id: decoded.id});

        const user = {
            id: data._id,
            username: data.email,
            name: data.name,
            role: data.role ? data.role : 'admin',
            credits: data.credits,
            subscription: data.subscription
        };

        //Change expiry to 1hr (1h) after testing
        const newAccessToken = jwt.sign(user, secret, {expiresIn: '1h'});

        return {newAccessToken, user};
    }catch(error){
        console.log(error);
        throw error;
    }
};

module.exports = { attemptToRefreshToken };