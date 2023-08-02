import React from 'react'
import '../css/About.css'
import image from '../images/about-unsplash.jpg'

const AboutPage = () => {  

    return (
        <div className='About-Page'>
                <div className='about-top'>
                    <h1 className ='about-heading'>About us</h1>
                    <img className='about-image' src={image} alt='about'/>
                    <div className ='about-text'>
                        <p><b>Loop Agile Now</b> is a secure messaging platform</p>
                        <p>to stay connected in the professional environment.</p>
                    </div>
                </div>
                <div className='about-bottom'>
                </div>
        </div>
    )
}

export default AboutPage