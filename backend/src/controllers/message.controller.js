import Message from "../models/messages.model.js";
import User from "../models/users.model.js";
import minioClient from "../libs/minio.js";

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser)
    } catch (error) {
        res.status(500).json({error: "Erreur de serveur"})
    }
}

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params
        const MyId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:MyId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:MyId},
            ]
        })
        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({error: "Erreur de serveur"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body
        const { id: receiverId} = req.params
        const senderId = req.user._id
        
        let imageUrl;

        if (image){
            const bufferedImage = Buffer.from(image.split(",")[1], "base64")
            const mystream = senderId + "-" + Date.now()+".jpg"
            const sizeImage = bufferedImage.length

            await minioClient.putObject(process.env.MINIO_DEFAULT_BUCKET, mystream , bufferedImage , sizeImage)

            imageUrl = "http://localhost:9000" + "/" + process.env.MINIO_DEFAULT_BUCKET + "/" + mystream
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content: text,
            image: imageUrl
        })

        await newMessage.save();
        res.status(201).json(newMessage)


    } catch (error) {
        res.status(500).json({error: "Erreur de serveur"})
    }
}