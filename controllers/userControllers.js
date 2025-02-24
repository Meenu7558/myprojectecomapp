import {User}  from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";


export const userSignup = async (req,res,next) =>{
try {
     console.log("hitted");
    const {name,email,password,phone,profilepic}=req.body;

      if( !name|| !email|| !password|| !phone)
     {
        return res.status(400).json({message:"all fields are required"});
     }
     
        const isUserExit =await User.findOne({email});

        if(isUserExit){
        
            return res.status(400).json({message:"user already exist"});
        
        }
         const hashedPassword = bcrypt.hashSync(password,10 );

        const userData = new User({name,email,password:hashedPassword,phone,profilepic});
        await userData.save();

        const token = generateToken(userData._id);
        res.cookie("token",token);
        delete userData._doc.password;
        return res.json({data:userData,message:"user account created"});

} catch (error) {
        return res.status(error.statusCode || 500).json({message:error.message || "Internal servererror"});
}
};

export const userLogin = async (req, res, next) => {
        try {
          const { email, password } = req.body;
          console.log("Login attempt for:", email);
      
          if (!email || !password) {
            console.log("Missing fields");
            return res.status(400).json({ message: "All fields are required" });
          }
      
          const user = await User.findOne({ email });
          console.log("User found:", user);
      
          if (!user) {
            console.log("User does not exist");
            return res.status(404).json({ message: "User does not exist" });
          }
      
          const passwordMatch = bcrypt.compareSync(password, user.password);
          console.log("Password match:", passwordMatch);
      
          if (!passwordMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: "User not authenticated" });
          }
      
          const token = generateToken(user._id);
          console.log("Generated token:", token);


          if (!token) {
            console.log("Token generation failed");
            return res.status(500).json({ message: "Token generation failed" });
          }


          res.cookie("token",token);
          delete user._doc.password;
          return res.json({ data: user, token, message: "User login successful" });
        } catch (error) {
          console.error("Login error:", error);
          return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
        }
      };
      
        
      export const userProfile = async (req,res,next) =>{
        try {

               const userId = req.user.id;
               const userData=await User.findById(userId).select("-password");
               if (!userData) {
                return res.status(404).json({ message: "User not found", success: false });
            }
    

                return res.json({ data : userData, message: "user profile fetched" ,success: true  });

        }catch (error) {
                return res.status(error.statusCode || 500).json({message:error.message || "Internal server error"});
        }
        
        
        };
        export const userLogout = (req, res) => {
          res.status(200).json({ message: "Logout successful" });
      };

      export const updateUserProfile = async (req, res) => {
        try {
            const { name, email } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { name, email },
                { new: true, runValidators: true }
            );
    
            res.status(200).json({ message: "Profile updated", user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    };

    export const forgotPassword = async (req, res) => {
      try
      {
      
      const { email } = req.body;

      //  email to lowercase 
      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) return res.status(404).json({ message: "User not found" });

      //  reset token
      const resetToken = Math.random().toString(36).slice(2);

      // expiry time 
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

      await user.save();

      res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};
  



export const changePassword = async (req, res) => {
  try {
    
    const { oldPassword, newPassword } = req.body;

  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

  
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password with the hashed password in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // new password =old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

   

    
    user.password = await bcrypt.hash(newPassword, 10);

    
    await user.save();

    
    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

    
  


export const deactivateAccount = async (req, res) => {
  try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};
export const checkUser = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (user) {
          res.status(200).json({ message: "Email already exists", exists: true });
      } else {
          res.status(200).json({ message: "Email is available", exists: false });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};

        
             