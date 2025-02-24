import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
      name:{
        type:String,
        required:true,
        maxLength:50,
      },
      email:{
         type:String,
         unique:true,
         required:true,
         minLength:3,
         maxLength:35

      },
     password:{
        type:String,
        required:true,
        minLen:8
     },
     profilepic:{
       type:String,
       defualt:"https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
     },
     phone:{
        type:String,
         unique:true
     },
     isActive:{
        type:Boolean,
        default:true
     }

}
);

export const Seller =mongoose.model('seller',sellerSchema);
