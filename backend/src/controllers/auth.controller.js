import { generateToken } from "../libs/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res) =>{
    const {fullName,email,password} = req.body
    try{
        if (password.length < 6) {
            return res.status(400).json({message: "Votre mot de passe doit contenir au moins 6 caractères"});
        }
        
        const user = await User.findOne({email});
        if (user){ return res.status(400).json({message : "Un utilisateur utilise déja cet email"})};

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Mot de passe haché :', hashedPassword);
        
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        }else {
            res.status(400).json({message: "Utilisateur invalide"})
        }

    }catch(error){
        console.log('Erreur lors de la création du nouvel utilisateur :', error);
    }
}
export const login = (req,res) =>{
    res.send("login route");
}
export const logout = (req,res) =>{
    res.send("logout route");
}