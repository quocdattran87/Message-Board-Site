import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../css/Footer.css'

const Footer = ({ setCurrentPage }) => {  

    function buttonPress(page) {
          setCurrentPage(page)
          localStorage.setItem('currentPage', page)
    }

    let activeClassName = 'active'
    return (
        <div className='footer-custom'>
            <ul className='footer-list'>
                <li className='footer-details'><small>Developed by Quoc Tran 2022</small></li>
                <li className='footer-item'><NavLink onClick={() => setCurrentPage('about')} to='about' className={({ isActive }) => isActive ? activeClassName : undefined} style={{ textDecoration: 'none' }}><button className='footer-button' onClick={() => buttonPress('about')}>About</button></NavLink></li>
                <li className='footer-item'><NavLink onClick={() => setCurrentPage('contact')} to='contact' className={({ isActive }) => isActive ? activeClassName : undefined} style={{ textDecoration: 'none' }}><button className='footer-button' onClick={() => buttonPress('contact')}>Contact</button></NavLink></li>
            </ul>
        </div>
    )
}

export default Footer