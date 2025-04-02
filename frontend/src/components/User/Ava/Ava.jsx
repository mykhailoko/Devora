import React, { useEffect, useState } from 'react';
import "./Ava.css";
import axios from 'axios';
import AvaIcon from "../../../assets/ava.png";
import { useParams } from 'react-router-dom';

function Ava() {
	const { id } = useParams();
	const [avatar, setAvatar] = useState("");
	const [username, setUsername] = useState("");
	const [currentUserId, setCurrentUserId] = useState(null);
	const [following, setFollowing] = useState([]);
	const [showFollowButton, setShowFollowButton] = useState(true);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`https://devora-frontend-phi.vercel.app/user/${id}`, { withCredentials: true })
        .then(result => {
			if(result.data){
				setUsername(result.data.username)
				setAvatar(result.data.avatar)
			}
        })
        .catch(err => console.log(err))
	}, [id]);
		
	useEffect(() => {
        axios.get(`https://devora-frontend-phi.vercel.app/user`)
            .then(result => {
                if (result.data) {
                    setCurrentUserId(result.data._id);
                    setFollowing(result.data.following || []); 
                    setShowFollowButton(!(result.data.following || []).includes(id));
                }
            })
            .catch(err => console.log(err));
    }, [id]);

	const handleFollow = () => {
        axios.post(`https://devora-frontend-phi.vercel.app/follow/${id}`)
            .then(result => {
                setFollowing(result.data.following);
				setShowFollowButton(false);
            })
            .catch(err => console.log(err));
    };

	const handleUnfollow = () => {
		axios.delete(`https://devora-frontend-phi.vercel.app/unfollow/${id}`)
			.then(result => {
				setFollowing(result.data.following);
				setShowFollowButton(true);
			})
			.catch(err => console.log(err));
	};

	const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    };

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (file && currentUserId) {  
			try {
				const base64 = await convertToBase64(file);
				setAvatar(base64);
				
				const response = await axios.put(
					`https://devora-frontend-phi.vercel.app/update-avatar/${currentUserId}`,
					{ avatar: base64 }
				);
				
				if (response.data.avatar) {
					setAvatar(response.data.avatar);
				}
			} catch (err) {
				console.error("Error updating avatar:", err);
			}
		}
	};

  	return (
		<div className='ava-container'>
			<div className='username-container'>
				<label htmlFor="file-upload" className="custom-file-upload">
					<img src={avatar ? avatar : AvaIcon} alt='avatar' className='ava-icon'/>
				</label>
                    <input 
                        type="file"
                        label="Image"
                        name="myAva"
                        id="file-upload"
                        accept=".jpeg, .png, .jpg"
                        onChange={(e) => handleFileUpload(e)}
                    />
				<h2 className='username'>{username}</h2>
			</div>
			{currentUserId !== id && (
				showFollowButton ? (
					<button className='follow' onClick={handleFollow}>Follow</button>
				) : (
					<button className='follow' onClick={handleUnfollow}>Unfollow</button>
				)
			)}
		</div>
  	)
}

export default Ava;