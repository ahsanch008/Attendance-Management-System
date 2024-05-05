const authorization = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ Message:"Unauthorized access !!!"});
        }

        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            return res.status(401).json({  Message:"Unauthorized access" });
        }

        next();
    };
};

module.exports = {
    authorization,
};
