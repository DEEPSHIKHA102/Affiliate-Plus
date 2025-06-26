const jwt = require('jsonwebtoken');


const authMiddleware = {
    protect: async (request, response, next) => {
        try{
            const token = request.cookies?.jwtToken;
            if(!token){
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }
            const user = jwt.verify(token, process.env.JWT_SECRET);
            request.user = user;
            next();
        }catch(error){
            console.log(error);
            response.status(500).json({
                error:"internal server error"
            });
        }
    },
};

module.exports = authMiddleware;