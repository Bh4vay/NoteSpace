const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(authHeader);
    if(!token) return res.status(401);

    jwt.verify(token, process.env.jwt_secret, (err, user)=>{
        if(err) return res.status(401);

        req.user = user;
        next();
    });
}

module.exports = {
    authenticationToken,
}
