const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const StartupModel = require('../models/Startup');
const NotificationModel = require('../models/Notification');
const MessageModel = require('../models/Message');
const ChatModel = require('../models/Chat');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            req.user = decoded;
            next();
        })
    }
}

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    UserModel.findOne({username: username})
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (response) {
                    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, {expiresIn: "1d"})
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "None", 
                        secure: true      
                    });
                    res.json("Success")
                } else {
                    res.json("the password is incorrect")
                }
            })
        } else {
            res.json("No record existed")
        }
    })
})

router.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.body;
    
        const existingUser = await UserModel.findOne({username});
        if (existingUser) {
            return res.status(400).json({error: "Username already exists"});
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({username, password: hash});
        res.status(201).json(newUser);
    } catch (err) {
        if (err.code === 11000) {  
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/home', verifyUser, (req, res) => {
    return res.json("Success")
})

router.get('/user', verifyUser, async (req, res) => {
    try {
        const user = await UserModel.findOne({username: req.user.username});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        return res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.put('/update-avatar/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { avatar } = req.body;

        if (id !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own avatar" });
        }

        const user = await UserModel.findByIdAndUpdate(
            id,
            { avatar },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ avatar: user.avatar });
    } catch (err) {
        console.error("Error updating avatar:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/update-portfolio', verifyUser, async (req, res) => {
    try {
        const { fullname, biography, skills, projects } = req.body;
        const user = await UserModel.findOneAndUpdate(
            { username: req.user.username },
            { fullname, biography, skills, projects },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/get-startups', async (req, res) => {
    try {
        const startups = await StartupModel.find();
        if(startups.length === 0) {
            return res.status(404).json({ message: "There are no startups." });
        }
        res.json(startups);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/get-user-startups/:id', verifyUser, async (req, res) => {
    try {
        const userId = req.params.id;
        const startups = await StartupModel.find({ userId: userId });
        if (startups.length === 0) {
            return res.status(404).json({ message: "User has no startups." });
        }
        res.json(startups);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/add-startup', verifyUser, async (req, res) => {
    const { name, description, developers } = req.body;
    const userId = req.user.id;
    if (!name || !description || !developers || !userId) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    if (isNaN(developers) || developers <= 0) {
        return res.status(400).send({ message: 'Number of developers must be a positive number.' });
    }

    try {
        const newStartup = await StartupModel.create({ 
            name, 
            description, 
            founder: req.user.username, 
            developers,
            userId
        });
        res.status(201).send(newStartup);
    } catch (err) {
        console.error('Error creating startup:', err);
        res.status(500).send({ message: 'Error creating startup.' });
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.json("Logged out successfully");
});

router.post('/follow/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to follow
        const userId = req.user.id; // ID of the current user

        await UserModel.findByIdAndUpdate(userId, {
            $addToSet: { following: id }
        });

        res.status(200).json({ message: "Followed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/get-following/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const user = await UserModel.findById(id)
            .populate({
                path: 'following',
                select: 'username avatar' // Явно указываем поля для выборки
            }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.following);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/unfollow/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to unfollow
        const userId = req.user.id; // ID of the current user

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await UserModel.findByIdAndUpdate(userId, {
            $pull: { following: id }
        });

        res.status(200).json({ message: "Unfollowed successfully", following: user.following });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/add-notification', verifyUser, async (req, res) => {
    try {
        const { sender, senderId, userId, startupName, startupId } = req.body;

        const newNotification = await NotificationModel.create({
            sender: sender,
            senderId: senderId,
            userId: userId,
            startupName: startupName,
            startupId: startupId
        });

        res.status(201).json(newNotification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating request' });
    }
});

router.delete('/delete-notification/:id', verifyUser, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await NotificationModel.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting notification" });
    }
});


router.get('/get-notifications', verifyUser, async (req, res) => {
    try {
        const userId = req.user.id;

        const startups = await StartupModel.find({ userId: userId });

        if (!startups || startups.length === 0) {
            return res.status(404).json({ message: "No startups found for this user" });
        }

        const notifications = await NotificationModel.find({
            startupId: { $in: startups.map(startup => startup._id) }
        });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user's startups" });
        }

        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/messages/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await ChatModel.findById(chatId).populate("messages");

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.json(chat.messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).send("Error fetching messages");
    }
});

router.post('/messages/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;
        const { username, text } = req.body;

        if (!username || !text) {
            return res.status(400).json({ error: "Необходимы username и текст" });
        }

        const newMessage = new MessageModel({ 
            username, 
            text, 
            chatId,
            timestamp: new Date() 
        });
        await newMessage.save();

        await ChatModel.findByIdAndUpdate(
            chatId,
            { $push: { messages: newMessage._id } }
        );

        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Ошибка:", err);
        res.status(500).send("Ошибка сохранения сообщения");
    }
});

router.post('/join-chat', async (req, res) => {
    const { userId, senderId, startupId, startupName } = req.body;

    try {
        let chat = await ChatModel.findOne({ startupId });

        if (!chat) {
            chat = new ChatModel({ startupId, startupName, participants: [userId, senderId] });
        } else {
            if (!chat.participants.includes(userId)) {
                chat.participants.push(userId);
            }
            if (!chat.participants.includes(senderId)) {
                chat.participants.push(senderId);
            }
        }

        await chat.save();
        res.json(chat);
    } catch (error) {
        console.error("Join Chat Error:", error);
        res.status(500).json({ message: "Error adding a chat" });
    }
});

router.get('/get-chats/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await ChatModel.find({ participants: userId }).populate('startupId', 'startupName');;
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats" });
    }
});

module.exports = router;