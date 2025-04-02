import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./SignupPage.css";

function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_URL}/signup`, {username, password})
        .then(result => {console.log(result)
            navigate('/login')
        })
        .catch(err => {
            if (err.response && err.response.status === 400) {
                alert(err.response.data.error);
            } else {
                console.log(err);
            }
        })
    }

    return (
        <div className='container-sign'>
            <div className='sign'>
                <h2 className='sign-title'>Sign Up</h2>
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
                        Sign Up
                    </button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" className='sign-link'>
                    Login
                </Link>
            </div>
        </div>
    )
}

export default SignupPage;