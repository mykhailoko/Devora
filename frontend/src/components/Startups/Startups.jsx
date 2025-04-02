import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Startups.css";
import { Link } from 'react-router-dom';

function Startups() {
    const [startups, setStartups] = useState([]);
    const [sentRequests, setSentRequests] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3001/get-startups')
            .then(res => {
                setStartups(res.data);
            })
            .catch(err => console.log(err));
    }, [startups]);

    const handleJoin = (userId, startupId, startupName) => {
        axios.get('http://localhost:3001/user', { withCredentials: true })
            .then(response => {
                const username = response.data.username; 
                const currentUserId = response.data._id; 

                axios.post('http://localhost:3001/add-notification', {
                    sender: username,
                    senderId: userId,
                    userId: currentUserId,
                    startupName: startupName,
                    startupId: startupId
                })
                .then(response => {
                    console.log('Notification added successfully:', response.data);
                    setSentRequests(prevState => ({ ...prevState, [startupId]: true }));
                })
                .catch(error => {
                    console.error('Error adding notification:', error);
                });
            })
            .catch(error => {
                console.error('Error getting user data:', error);
            });
    }

    return (
        <div className='startups-container' id='startups'>
            <h1 className='startups-title'>Startups</h1>
            <ul className='startups'>
                {startups.length === 0 ? (
                    <p>No startups available</p>
                ) : (
                    startups.map((startup, index) => (
                        <li className='startups-item' key={index}>
                            <div className='startups-item-container'>
                                <h2>{startup.name}</h2>
                            </div>
                            <div className='startups-item-container'>
                                <h5 className='startups-item-title'>Description:</h5>
                                <p>{startup.description}</p>
                            </div>
                            <div className='startups-item-container'>
                                <div className='line-item'>
                                    <h5 className='startups-item-title'>Founder:</h5>
                                    <Link to={`/user/${startup.userId}`} className='founder-link'>{startup.founder}</Link>
                                </div>
                                <div className='line-item'>
                                    <h5 className='startups-item-title'>Looking for:</h5>
                                    <p className='looking-for-developers'>{startup.developers}</p>
                                </div>
                            </div>
                            {!sentRequests[startup._id] ? (
                                <button 
                                    className='join-button' 
                                    onClick={() => handleJoin(startup.userId, startup._id, startup.name)}
                                >
                                    Join
                                </button>
                            ) : (
                                <span className='request-was-sent'>Request was sent</span> 
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default Startups;