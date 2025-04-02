import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import "./ChatPage.css";
import Navbar from '../../components/Navbar/Navbar';
import Bar from "../../assets/bar.png";
import CrossChat from "../../assets/cross-chat.png";

const socket = io(`${process.env.REACT_APP_API_URL}`);

function ChatPage() {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showChats, setShowChats] = useState(false);

    const toggleChats = () => {
        setShowChats(!showChats);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user`, { withCredentials: true })
            .then(response => {
                setUsername(response.data.username);
                setUserId(response.data._id);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (userId) {
            axios.get(`${process.env.REACT_APP_API_URL}/get-chats/${userId}`)
                .then(response => {
                    setChats(response.data);
                })
                .catch(err => console.log(err));
        }
    }, [userId]);

    useEffect(() => {
        if (selectedChat) {
            axios.get(`${process.env.REACT_APP_API_URL}/messages/${selectedChat._id}`)
                .then(response => {
                    setMessages(response.data);
                    socket.emit("joinChat", selectedChat._id);
                })
                .catch(err => console.log(err));
        }
    }, [selectedChat]);

    useEffect(() => {
        socket.on("chat", (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off("chat"); 
        };
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;
    
        const messageData = {
            chatId: selectedChat._id,
            username,
            text: newMessage
        };
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/messages/${selectedChat._id}`,
                messageData
            );
            
            setMessages(prev => [...prev, response.data])
            setNewMessage("");
        } catch (err) {
            console.error("Ошибка при отправке сообщения:", err);
        }
    };

    return (
        <div className='chat-page'>
            <Navbar />

            <div className='messages-container'>
                <div className={`all-chats ${showChats ? 'visible' : ''}`}>
                    <h2>Chats</h2>
                    {chats.length > 0 ? (
                        <ul>
                            {chats.map(chat => (
                                <li key={chat._id} onClick={() => { 
                                    setSelectedChat(chat); 
                                    setShowChats(false);
                                }}>
                                    {chat.startupName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You don't have chats yet</p>
                    )}
                </div>

                <div className='chat-container'>
                    <div className='chat-title'>
                        <img 
                            className='bar' 
                            alt='bar' 
                            src={showChats ? CrossChat : Bar} 
                            onClick={toggleChats} 
                        />
                        <h2>{selectedChat ? selectedChat.startupName : "Select a chat"}</h2>
                    </div>
                
                    <div className='messages'>
                        {messages.length > 0 ? (
                            messages.map((msg, index) => 
                                (
                                <div key={index} className={msg.username === username ? 'message my-message' : 'message other-message'}>
                                    <div>
                                        <div className='message-name'>{msg.username === username ? 'You' : msg.username}</div>
                                        <div className='message-text'>{msg.text}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='no-messages'></p>
                        )}
                    </div>

                    {selectedChat ? (
                    <div className='chat-input'>
                        <input 
                            type='text' 
                            id='message-input'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder='Message' 
                        />
                        <button id='send-message' onClick={sendMessage}>Send</button>
                    </div>) : null}
                </div>
            </div>
        </div>
    )
}

export default ChatPage