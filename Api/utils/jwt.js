const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET;
const jwt_expires_in = process.env.JWT_EXPIRES_IN;

/* 
@param {object} payload contains user id,email,role
*/
const signJWT = (payload)=>{
    const token = jwt.sign(payload,jwt_secret,{expiresIn:jwt_expires_in});
    return `Bearer-${token}`
}

const verifyJWT = (token)=>{
    try{
        const tokenwithoutbearer = token.startsWith('Bearer-')? token.slice(7,token.length):false;
        if(tokenwithoutbearer){
            const decodedtoken = jwt.decode(tokenwithoutbearer);
            if(!decodedtoken){
                throw new Error('Invalid token');
            }

            const verifytoken = jwt.verify(tokenwithoutbearer,jwt_secret);
            return {
                userdata: { id: decodedtoken.id, email: decodedtoken.email, role: decodedtoken.role, name: decodedtoken.name },
                valid: true,
              }; 
        }
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            console.error('Token expired:', err.message);
        }else{
            console.error('Token verification failed:', err.message);
        }
    
        // Return invalid status if verification fails
        return {
            userdata: null,
            valid: false,
        };
    }
}

module.exports = { signJWT, verifyJWT };