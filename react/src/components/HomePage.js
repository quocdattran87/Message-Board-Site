import React from 'react'
import image from '../images/home-unsplash.jpg'
import image2 from '../images/home-loggedin-unsplash.jpg'
import '../css/HomePage.css'

const HomePage = (loggedInUser) => {  
    return (
        <div className='Home-Page'>
            {loggedInUser.loggedInUser === null ? 
                <><p className='home-text'>Welcome to Loop Agile Now</p>
                <img className='home-image' src={image} alt='home'/></>

            : <><p className='home-loggedin-text'>Stay connected</p>
                <img className='home-image' src={image2} alt='home'/></>
            }
        </div>
    )
}

export default HomePage