import { generateToken } from "../libs/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res) =>{
    const {fullName,email,password} = req.body
    try{

        if (!password || !email || !fullName ){
            return res.status(400).json({message: "Informations manquantes"});
        }

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

export const login = async (req,res) =>{
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Verifiez la combinaison email/mot de passe"})
        }
        const isPassOk = await bcrypt.compare(password, user.password)
        if(!isPassOk){
            return res.status(400).json({message:"Verifiez la combinaison email/mot de passe"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    }catch(error){
        console.log("Erreur sur les logins",error.message);
        res.status(500).json({ message: " Erreur en lien avec le serveur"});
    }
}
export const logout = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Vous avez été déconnecté"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Erreur en lien avec le serveur"})
    }
}

export const update = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}