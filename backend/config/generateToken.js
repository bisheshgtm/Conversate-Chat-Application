// install jsonwebtoken
// npm install jsonwebtoken

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '50d',
    });
}

module.exports = generateToken;
