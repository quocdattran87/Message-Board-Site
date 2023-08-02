import React from 'react'
import image from '../images/goodbye-unsplash.jpg'
import '../css/HomePage.css'

const LogOutPage = () => {  

    return (
        <div className='Home-Page'>
            <img className='home-image' src={image} alt='home'/>
        </div>
    )
}

export default LogOutPage