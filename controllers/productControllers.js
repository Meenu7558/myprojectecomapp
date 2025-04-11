import { cloudinaryInstance } from "../config/cloudinaryconfig.js";
import { Product}  from "../models/productModel.js";
import dotenv from 'dotenv';

dotenv.config();



export const getProducts = async (req,res,next) =>{
try {
      const productList=await Product.find().select("-description");
      res.json({data: productList ,message:"product list fetched"});


} catch (error) {
    return res.status(error.statusCode || 500).json({message:error.message || "Internal servererror"});
}

};
export const getProductDetails = async (req,res,next) =>{
    try {
        const {productId}=req.params;
        console.log(productId);
          const productList=await Product.findById(productId).populate("seller");
          
          res.json({data: productList ,message:"product details"});
    
    
    } catch (error) {
        return res.status(error.statusCode || 500).json({message:error.message || "Internal servererror"});
    }
    
    };
  
export const createProduct = async (req,res,next) =>{
        try {
         
            const {name,description,price,category,stock,seller}=req.body;
            
            if(!name || !description || !price || !category|| !stock)
                {
                    return res.status(404).json({ message: "all feilds are required" });
               
            }

            console.log('image===',req.file);


            const cloudinaryResponse= await cloudinaryInstance.uploader.upload(req.file.path);
            
            console.log("cldRes====",cloudinaryResponse);


          const productData= new Product({name,description,price,category,stock,image:cloudinaryResponse.secure_url,seller});
          await productData.save();

          res.json({data: productData ,message:"product created successfully"});
        
        } catch (error) {
            return res.status(error.statusCode || 500).json({message:error.message || "Internal servererror"});
        }
        
        };
       
    export const updateProduct = async (req, res, next) => {
                try {
                    const { id } = req.params; 
                    const { name, description, price, category, stock, seller } = req.body;
            
                    
                    if (!name || !description || !price || !category || !stock) {
                        return res.status(400).json({ message: "All fields are required" });
                    }
            
                    console.log('Uploaded Image:', req.file);
            
                    let updatedData = { name, description, price, category, stock, seller };
            
                
                    if (req.file) {
                        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
                        console.log("Cloudinary Response:", cloudinaryResponse);
                        updatedData.image = cloudinaryResponse.secure_url; 
                    }
            
                
                    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
            
                if (!updatedProduct) {
                        return res.status(404).json({ message: "Product not found" });
                    }
            
                    res.json({ data: updatedProduct, message: "Product updated successfully" });
            
                } catch (error) {
                    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
                }
            };
            export const deleteProduct = async (req, res) => {
                try {
                    const { id } = req.params;
            
                    // Find the product by ID
                    const product = await Product.findById(id);
                    if (!product) {
                        return res.status(404).json({ message: "Product not found" });
                    }
            
                    // Delete the product
                    await Product.findByIdAndDelete(id);
            
                    res.json({ message: "Product deleted successfully" });
                } catch (error) {
                    console.error("Error deleting product:", error);
                    return res.status(500).json({ message: "Internal server error" });
                }
            };