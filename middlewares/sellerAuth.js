import jwt from 'jsonwebtoken';

export const sellerAuth = async (req, res, next) => {
    try {
         const { token } = req.cookies;
         if (!token) {
            return res.status(401).json({message:"seller not autherised",success:false});
                
         }
         const tokenVerified= jwt.verify(token, process.env.JWT_SECRET_KEY);

         if (!tokenVerified) {
            return res.status(401).json({message:"seller not autherised",success:false});
                
         }
         req.seller = tokenVerified;

         next();
        
    } catch (error) {
        return res.status(401).json({message: error.message || "seller autherization failed",success:false});
                
    }
    
}; 
