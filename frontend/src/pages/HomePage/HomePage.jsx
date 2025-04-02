import React from 'react';
import "./HomePage.css";
import Header from '../../components/Header/Header';
import Startups from '../../components/Startups/Startups';

function HomePage() {
    return (
        <div>
            <Header />
            <Startups />
        </div>
    )
}

export default HomePage