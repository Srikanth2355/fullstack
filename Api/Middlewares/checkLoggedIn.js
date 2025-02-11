const {signJWT,verifyJWT} = require("../utils/jwt");

const checkLoggedIn = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized Request" });
    }
    try{
        const decodedtoken = verifyJWT(token);
        if(!decodedtoken.valid){
            return res.status(401).json({ error: "Unauthorized Request" });
        }
        req.user = decodedtoken.userdata;
        next();
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {checkLoggedIn};