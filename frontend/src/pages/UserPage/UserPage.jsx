import React, { useEffect } from 'react';
import "./UserPage.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Ava from '../../components/User/Ava/Ava';
import Following from '../../components/User/Following/Following';
import Portfolio from '../../components/User/Portfolio/Portfolio';
import StartupsUser from '../../components/User/StartupsUser/StartupsUser';

function UserPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`http://localhost:3001/user/${id}`)
        .then(result => {
            if (!result.data) {
                navigate("/home")
            }
        })
        .catch(err => navigate("/home"))
    }, [id, navigate])

    return (
        <div className='user-page'>
            <Navbar />
            <Ava />
            <div className='main-part'>
                <Portfolio />
                <StartupsUser />
                <Following />
            </div>
        </div>
    )
}

export default UserPage