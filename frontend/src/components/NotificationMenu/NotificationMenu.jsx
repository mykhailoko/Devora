import React, { useState, useEffect } from 'react';
import "./NotificationMenu.css";
import axios from 'axios';
import Yes from "../../assets/yes.png";
import No from "../../assets/no.png";

function NotificationMenu() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await axios.get('http://localhost:3001/get-notifications');
            setNotifications(response.data);
          } catch (error) {
            console.error("Error fetching notifications", error);
          }
        };
    
        fetchNotifications();
    }, []);

    const handleDeleteNotification = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:3001/delete-notification/${notificationId}`);
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification._id !== notificationId));
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };

    const handleAccept = async (notification) => {
        try {
            await axios.post("http://localhost:3001/join-chat", {
                userId: notification.userId,
                senderId: notification.senderId,
                startupId: notification.startupId,
                startupName: notification.startupName
            });
    
            handleDeleteNotification(notification._id);
        } catch (error) {
            console.error("Error adding a chat", error);
        }
    };
    
    return (
        <div className='notification-menu'>
            { notifications.length === 0 ? (
                <div className="notification-empty">У вас нет новых уведомлений</div>
            ) : (

            <ul className='notification-list'>
                {notifications.map((notification, index) => (
                    <li key={index} className='notification-item'>
                        <p><a href={`/user/${notification.userId}`}>{notification.sender}</a> sent a request to join your startup "{notification.startupName}"</p>
                        <button className='accept-button' onClick={() => handleAccept(notification)}>
                            <img src={Yes} alt='yes' />
                        </button>
                        <button className='accept-button' onClick={() => handleDeleteNotification(notification._id)}>
                            <img src={No} alt='no' />
                        </button> 
                    </li>
                ))}
            </ul> )}
        </div>
    )
}

export default NotificationMenu