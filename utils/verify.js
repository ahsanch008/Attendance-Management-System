const jwt = require('jsonwebtoken');

function verify  (req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.redirect("/home");
            return; 
        }
        const decodedToken = jwt.verify(token, "AttendanceManagementSystem");
        req.user = { 
            fullName: decodedToken.fullName, 
            role:decodedToken.role
        };
        next();
    } catch (error) {
        res.status(500).json({ error: "Invalid or expired token" });
    }
};

module.exports = verify;
