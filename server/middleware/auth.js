const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header (usually sent as 'x-auth-token')
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.admin; // Attach admin info to the request object
        next(); // Move to the next function 
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};