const jwt = require("jsonwebtoken");
const User = require("./models/User");


exports.authenticationToken = async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);

    if (!token) {
        
        return res.sendStatus(401);
    }

    try {
        // decode the token
        
        const decode = jwt.verify(token, "1dsad3232rfkfuy429u4udy3iiufasdb49039hufbfayggj");
        // token verify krke req me user field attach krkek db se user fetch krke kal dega 
        // console.log(decode.id);
        req.user = await User.findById(decode.id);

        // console.log(req.user);

        if (!req.user) {
            return res.sendStatus(401);
        }

        next();
    } catch (error) {
        return res.sendStatus(401);
    }
};