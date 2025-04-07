import React, { useEffect, useState } from 'react';
import "./Following.css";
import AvaIcon from "../../../assets/ava.png";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function Following() {
    const { id } = useParams(); ;
    const [followingUsers, setFollowingUsers] = useState([]);

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                const response = await axios.get(`https://devora-a75l.onrender.com/get-following/${id}`);
                setFollowingUsers(response.data);
            } catch (err) {
                console.error("Error fetching followed users", err);
            }
            };
    
            fetchFollowingUsers();
    }, [id]);

    return (
        <div className='following-container'>
            <h2 className='following-title'>Following</h2>
            <ul className='username-list'>
                {followingUsers.map(user => (
                <li key={user._id} className='username-item'>
                    <img src={user.avatar ? user.avatar : AvaIcon} alt='ava' className='ava-item'/>
                    <Link to={`/user/${user._id}`} className='username-name'>
                        {user.username}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default Following;