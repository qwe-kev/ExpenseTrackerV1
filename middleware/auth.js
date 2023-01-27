const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.header('authorization')
    console.log("body", req.body);

    console.log("token ---->",token);

    if(!token) {
        return res.status(403).send('token missing for authentication');
    }

    try {
        const decodeToken = jwt.verify(token, config.SECRET_KEY);
        console.log("decoded token --->",decodeToken)
        req.user = decodeToken;
    }
    catch(err) {
        console.log("token ---->",token);
        return res.status(401).send('invalid token!');
    }
    return next();
}

module.exports = verifyToken;