import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import  cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connectDB } from "./libs/db.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log("Le serveur écoute sur le port : " + PORT)
    connectDB()
})