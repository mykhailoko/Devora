import React, { useState, useEffect } from 'react';
import "./Portfolio.css";
import Pencil from "../../../assets/pencil.png";
import Cross from "../../../assets/cross.png";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Portfolio() {
    const { id } = useParams();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [portfolioEditor, setPortfolioEditor] = useState(false);
    const [fullname, setFullname] = useState("-");
    const [biography, setBiography] = useState("-");
    const [skills, setSkills] = useState("-");
    const [projects, setProjects] = useState([
        { name: "-", link: "-" },
        { name: "-", link: "-" },
        { name: "-", link: "-" }
    ]);

    const [tempFullname, setTempFullname] = useState(fullname);
    const [tempBiography, setTempBiography] = useState(biography);
    const [tempSkills, setTempSkills] = useState(skills);
    const [tempProjects, setTempProjects] = useState(projects.map(project => ({
        ...project,  
        tempName: project.name, 
        tempLink: project.link
    })));

    useEffect(() => {
        axios.get(`https://devora-frontend-phi.vercel.app/user`, { withCredentials: true })
            .then(res => {
                setCurrentUserId(res.data?._id);
            })
            .catch(err => console.log(err));

        axios.get(`https://devora-frontend-phi.vercel.app/user/${id}`)
            .then(res => {
                const user = res.data;
                setFullname(user.fullname);
                setBiography(user.biography);
                setSkills(user.skills);
                
                const defaultProjects = user.projects && user.projects.length > 0 
                    ? user.projects : [{ name: "-", link: "-" }, { name: "-", link: "-" }, { name: "-", link: "-" }];
                setProjects(defaultProjects);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSave = () => {
        const updatedPortfolio = {
            fullname: tempFullname,
            biography: tempBiography,
            skills: tempSkills,
            projects: tempProjects.map(({ tempName, tempLink }) => ({
                name: tempName,
                link: tempLink
            }))
        };

        axios.put(`https://devora-frontend-phi.vercel.app/update-portfolio`, updatedPortfolio)
            .then(res => {
                setFullname(res.data.fullname);
                setBiography(res.data.biography);
                setSkills(res.data.skills);
                setProjects(res.data.projects);
                setAvatar({ myFile: res.data.avatar });
                setPortfolioEditor(false);
            })
            .catch(err => console.log(err));
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...tempProjects];
        newProjects[index][field] = value;
        setTempProjects(newProjects);
    };

    return (
        <div className='portfolio-container'>
            {portfolioEditor ? (
                <div className='overlay'>
                    <div className='portfolio-editor'>
                        <h2 className='portfolio-editor-title'>Portfolio</h2>
                        <button className='cross-button' onClick={() => setPortfolioEditor(false)}>
                            <img src={Cross} alt='cross' className='cross' />
                        </button>

                        <ul className='portfolio-editor-list'>
                            <li className='portfolio-editor-item'>
                                <h5>Full name:</h5>
                                <input 
                                    type="text" 
                                    className='input-editor'
                                    value={tempFullname} 
                                    onChange={(e) => setTempFullname(e.target.value)}
                                />
                            </li>

                            <li className='portfolio-editor-item'>
                                <h5>Biography:</h5>
                                <textarea 
                                    type="text" 
                                    className='input-editor'
                                    value={tempBiography} 
                                    onChange={(e) => setTempBiography(e.target.value)} 
                                />
                            </li>
                            <li className='portfolio-editor-item'>
                                <h5>Skills:</h5>
                                <textarea 
                                    type="text" 
                                    className='input-editor'
                                    value={tempSkills} 
                                    onChange={(e) => setTempSkills(e.target.value)} 
                                />
                            </li>
                            <li className='portfolio-editor-item'>
                                <h5>Projects:</h5>
                                <div className='projects-editor-list'>
                                    {tempProjects.map((project, index) => (
                                        <div key={index} className='project-item'>
                                            <input 
                                                type="text" 
                                                className='input-editor' 
                                                value={project.tempName} 
                                                onChange={(e) => handleProjectChange(index, 'tempName', e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                className='input-editor' 
                                                value={project.tempLink} 
                                                onChange={(e) => handleProjectChange(index, 'tempLink', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </li>
                        </ul>

                        <button className='save' onClick={handleSave}>Save</button>
                    </div>
                </div>
            ) : null}


            <div className='portfolio-title-container'>
                <h2 className='portfolio-title'>Portfolio</h2>
                {currentUserId === id && (
                    <button className='pencil-button' onClick={() => {
                        setTempFullname(fullname);
                        setTempBiography(biography);
                        setTempSkills(skills);
                        setTempProjects(projects.map(project => ({
                            ...project,
                            tempName: project.name,
                            tempLink: project.link
                        })));
                        setPortfolioEditor(true);
                    }}>
                        <img src={Pencil} alt='pencil' className='pencil' />
                    </button>
                )}
            </div>
            <ul className='portfolio-list'>
                <li className='portfolio-item'>
                    <h5 className='fullname'>{fullname}</h5>
                </li>
                <li className='portfolio-item'>
                    <h6 className='item-title'>Biography:</h6>
                    <p>{biography}</p>
                </li>
                <li className='portfolio-item'>
                    <h6 className='item-title'>Skills:</h6>
                    <p>{skills}</p>
                </li>
                <li className='portfolio-item'>
                    <h6 className='item-title'>Projects:</h6>
                    <div className='projects-list'>
                        {projects.map((project, index) => (
                            <a key={index} href={project.link}>{project.name}</a>
                        ))}
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Portfolio