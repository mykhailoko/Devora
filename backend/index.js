const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const MessageModel = require('./models/Message');

const app = express()
const server = require("http").createServer(app)

/*const io = require("socket.io")(server, {
    cors: {
        origin: ["https://devora-frontend-bco90ozoq-michaels-projects-c4856009.vercel.app"],
        // http://localhost:5173
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});*/

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

/*io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    socket.on("chat", async function(message) {
        try {
            const newMessage = new MessageModel({
                chatId: message.chatId,
                username: message.username,
                text: message.text,
            });
            await newMessage.save();
            await ChatModel.findByIdAndUpdate(
                message.chatId,
                { $push: { messages: newMessage._id } }
            );
            io.to(message.chatId).emit("chat", newMessage);
        } catch (err) {
            console.error("Ошибка сохранения сообщения:", err);
        }
    });

    socket.on("joinChat", (chatId) => {
        socket.join(chatId); 
    });
});*/

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cors({
    origin: ['https://devora-a75l.onrender.com', 'https://devora-frontend.onrender.com'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser())

mongoose.connect(MONGO_URI)

app.use(authRoutes)

server.listen(3001, () => {
    console.log("server is running")
})