import React from 'react'
import '../css/Contact.css'
import image from '../images/contact-unsplash.jpg'

const ContactPage = () => {  

    return (
        <div className='Contact-Page'>
            <div className='contact-top'>
                <h1 className ='contact-heading'>Contact</h1>
            </div>
            <div className='contact-bottom'>
                <img className='contact-image' src={image} alt='about' />   
                <div className='contact-right'>
                    <div className='contact-details'>
                        <h1><b>Loop Agile</b></h1>
                        <p>420 High Street,</p>
                        <p>VIC, Melbourne 3000</p>
                        <p>mail@loopagile.com</p>
                        <p>p:03 9648 3200</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage