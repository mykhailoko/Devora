import React, { useState, Suspense } from 'react';
import axios from 'axios';
import "./Header.css";
import Background1 from "../../assets/bg1.png";
import Arrow from "../../assets/arrow.png";
import Navbar from '../Navbar/Navbar';
import Cross from "../../assets/cross.png";
import Astronaut from "../../assets/astronaut.png";
import Planet from "../../assets/planet.png";

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Setup from '../../../public/Setup';

function Header() {
    const [startupEditor, setStartupEditor] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [developers, setDevelopers] = useState("");

    const [tempName, setTempName] = useState(name);
    const [tempDescription, setTempDescription] = useState(description);
    const [tempDevelopers, setTempDevelopers] = useState(developers);

    const handleSaveStartup = () => {
        const updatedStartupEditor = {
            name: tempName,
            description: tempDescription,
            developers: tempDevelopers
        };

        axios.post(`https://devora-frontend-phi.vercel.app/add-startup`, updatedStartupEditor)
            .then(res => {
                if (res.data) {
                    setName(res.data.name);
                    setDescription(res.data.description);
                    setDevelopers(res.data.developers);
                    setStartupEditor(false);
                } else {
                    alert("Fill in all fields!");
                }
            })
            .catch(err => {
                if (err.response && err.response.data.message) {
                    alert(err.response.data.message);
                } else {
                    alert("Something went wrong, please try again later.");
                }
                console.log(err);
            });
    };

    function scrollToStartups() {
        const startupsSection = document.getElementById("startups");
        if (startupsSection) {
            startupsSection.scrollIntoView({ behavior: "smooth" });
        }
    }    

    return (
        <div className='home'>
            <Navbar />

            <div className='title'>
                <div className='right-part'>
                    <h1 className='header-title'>Devora</h1>
                    <h2 className='header-description'>Share your startup ideas and find collaborators to bring them to life!</h2>
                    <div className='header-buttons'>
                        <button className='header-one-button' onClick={scrollToStartups}>
                            View Startups
                            <img src={Arrow} alt='arrow' className='arrow' />
                        </button>
                        <button className='header-one-button' onClick={() => setStartupEditor(true)}>
                            Create Startup
                        </button>
                    </div>
                </div>
                <Canvas id='setupCanvas'>
                    <ambientLight />
                    <OrbitControls enableZoom={false} />
                    <Suspense fallback={null}>
                        <Setup scale={[53, 53, 53]} rotation={[Math.PI / 20, 0, 0]} position={[1.2, -2.3, 0]} />
                    </Suspense>
                    <Environment preset='sunset' />
                </Canvas>
            </div>
            <img src={Background1} alt='bg' className='background' />

            
            {startupEditor ? (
                <div className='startup-overlay'>
                    <div className='startup-editor'>
                        <img src={Astronaut} alt='astronaut' className='startup-editor-left' />
                        <div className='startup-editor-right'>
                            <h2 className='startup-editor-title'>Create Startup</h2>
                            <button className='startup-cross-button' onClick={() => setStartupEditor(false)}>
                                <img src={Cross} alt='cross' className='startup-cross' />
                            </button>

                            <ul className='startup-editor-list'>
                                <li className='startup-editor-item'>
                                    <h5>Startup Name:</h5>
                                    <input 
                                        type="text" 
                                        className='startup-input-editor'
                                        value={tempName} 
                                        onChange={(e) => setTempName(e.target.value)}
                                    />
                                </li>
                                <li className='startup-editor-item'>
                                    <h5>Description:</h5>
                                    <textarea 
                                        type="text" 
                                        className='startup-input-editor'
                                        value={tempDescription} 
                                        onChange={(e) => setTempDescription(e.target.value)}
                                    />
                                </li>
                                <li className='startup-editor-item'>
                                    <h5>How many developer are you looking for?</h5>
                                    <input 
                                        type="text" 
                                        className='startup-input-editor'
                                        value={tempDevelopers} 
                                        onChange={(e) => setTempDevelopers(e.target.value)}
                                    />
                                </li>
                            </ul>
                            <button className='startup-save' onClick={handleSaveStartup}>Save</button>
                        </div>
                        <img src={Planet} alt='planet' className='planet' />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default Header;