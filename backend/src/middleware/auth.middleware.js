import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Pas de token JWT défini"});
        }

        
    } catch (error) {
        
    }


}