require("dotenv").config({ path: `${process.cwd()}/.env` });
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET_KEY
        );
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

module.exports = authMiddleware;
