const user = require('../Model/userModel');
const jwt = require('jsonwebtoken');

exports.auth = (roles = []) => {
    return async (req, res, next) => {
        let authorization = req.headers['authorization']
        if (authorization) {
            try {
                const token = authorization.startsWith("Bearer ")
                    ? authorization.split(" ")[1]
                    : authorization;

                if (!token) {
                    return res.status(404).json({ status: 404, success: false, message: "Token Is Required" })
                }

                console.log('token', process.env.SECRET_KEY)
                
                let checkToken = jwt.verify(token, process.env.SECRET_KEY)

                console.log('token1', checkToken)

                // tokens are signed with an object payload like { _id: userId }
                const userIdFromToken = checkToken?._id || checkToken?.id || checkToken;
                let checkUser = await user.findById(userIdFromToken)

                req.user = checkUser;

                if (!checkUser) {
                    return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
                }

                // if (!roles.includes(checkUser.role)) {
                //     return res.status(404).json({ status: 404, success: false, message: "Unauthorize Access" })
                // }

                next();

            } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, success: false, message: error.message })
            }
        }
        else {
            return res.status(500).json({ status: 500, success: false, message: "Authorization Token Is Require" })
        }
    }
} 