import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Pas de token JWT défini"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Problème de Token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        
        if(!user){
            return res.status(404).json({message: "Utilisateur introuvable"})
        }

        req.user = user 
        
        next()

    } catch (error) {   
        
    }


}