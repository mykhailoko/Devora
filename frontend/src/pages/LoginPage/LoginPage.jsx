import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./LoginPage.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`https://devora-frontend-phi.vercel.app/login`, {username, password})
        .then(result => {
            if  (result.data === "Success") {
                navigate('/home')
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='container-sign'>
            <div className='sign'>
                <h2 className='sign-title'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                            className='sign-input'
                            type='text'
                            placeholder='Enter username'
                            name='email'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            className='sign-input'
                            type='password'
                            placeholder='Enter password'
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className='sign-button'>
                        Login
                    </button>
                </form>
                <p>Don't have an account?</p>
                <Link to="/signup" className='sign-link'>
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default LoginPage;