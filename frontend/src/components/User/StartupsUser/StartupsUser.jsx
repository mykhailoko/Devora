import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./StartupsUser.css";
import { useParams } from 'react-router-dom';

function StartupsUser() {
    const { id } = useParams();
	const [userStartups, setUserStartups] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
	
	useEffect(() => {
		axios.get(`https://devora-frontend-phi.vercel.app/get-user-startups/${id}`)
            .then(res => {
                if (res.data.length === 0) {
                    setErrorMessage("User has no startups");
                } else {
                    setUserStartups(res.data);
                    setErrorMessage("");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setErrorMessage("User has no startups");
                } else {
                    setErrorMessage("An error occurred while fetching the startups");
                }
            });
	}, [id]);

  	return (
		<div className='startups-user-container'>
			<h2 className='startups-user-title'>Startups</h2>
			<ul className='user-startups'>
                {userStartups.length === 0 || errorMessage ? (
                    <p>{errorMessage}</p>
                ) : (
                    userStartups.map((startup, index) => (
                        <li className='user-startups-item' key={index}>
                            <div className='user-startups-item-container'>
                                <h2>{startup.name}</h2>
                            </div>
                            <div className='user-startups-item-container'>
                                <h5 className='user-startups-item-title'>Description:</h5>
                                <p>{startup.description}</p>
                            </div>
                            <div className='user-startups-item-container'>
                                <div className='user-line-item'>
                                    <h5 className='user-startups-item-title'>Founder:</h5>
                                    <p className='user-founder-link'>{startup.founder}</p>
                                </div>
                                <div className='user-line-item'>
                                    <h5 className='user-startups-item-title'>Looking for:</h5>
                                    <p className='user-looking-for-developers'>{startup.developers}</p>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
		</div>
  	)
}

export default StartupsUser;