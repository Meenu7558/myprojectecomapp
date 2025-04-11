
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    try {
        console.log("Headers Received:", req.headers);  
        console.log("Cookies Received:", req.cookies);  

        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        console.log("Extracted Token:", token); 

        if (!token) {
            return res.status(401).json({ message: "User not authorized (No token provided)", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        console.log("Verified Token Payload:", tokenVerified); 

        if (!tokenVerified) {
            return res.status(401).json({ message: "User not authorized (Invalid token)", success: false });
        }

        req.user = tokenVerified;
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message); 
        return res.status(401).json({ message: "User authorization failed", success: false });
    }
};
