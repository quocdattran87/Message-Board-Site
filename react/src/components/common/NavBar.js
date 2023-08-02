import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import logo from '../../images/logo.png'
import '../../css/NavBar.css'

const NavBar = ({ currentPage, setCurrentPage, loggedInUser, setLoggedInUser, test }) => {  
  const navigate = useNavigate()

  function buttonPress(page, logOut) {
    if (test && logOut) {
      localStorage.setItem('currentPage', page)
      navigate(page, { replace: true })
      localStorage.removeItem('loggedInUser')
    }
    else if (logOut) {
      if (window.confirm('Log out?')) {
        setCurrentPage(page)
        localStorage.setItem('currentPage', page)
        navigate(page, { replace: true })
        setLoggedInUser(null)
        localStorage.removeItem('loggedInUser')
      }
    } else {
      if (!test) {
        setCurrentPage(page)
      }
      localStorage.setItem('currentPage', page)
      navigate(page)
    }
  }
  let activeClassName = 'active-button';
  return (
    <div className='nav-bar'>
      <ul className='nav-bar-list'>
        <li className='nav-bar-item'><button className='lan-logo' onClick={() => buttonPress('/')}><img src={logo} alt='LAN logo' width='30' height='21'/></button></li>
        <li className='nav-bar-item'><button className='home-button' onClick={() => buttonPress('/')}>LAN</button></li>
        <li className='nav-bar-item'><button className='slogan-button'>{'('} Be agile {')'}</button></li>
        {
          currentPage !== 'login' && currentPage !== 'signup' && (loggedInUser === null)? 
          <>
            <li className='nav-bar-item' style={{float:'right'}}><button className='nav-button' onClick={() => buttonPress('signup')}>Sign Up</button></li>
            <li className='nav-bar-item' style={{float:'right'}}><button className='nav-button' onClick={() => buttonPress('login')}>Login</button></li>
          </>
          : ''
        }
        {
          loggedInUser !== null && currentPage !== 'profile' 
          ? 
          <li className='nav-bar-item' style={{float:'right'}}><button className='nav-button' onClick={() => buttonPress('profile')}>@{loggedInUser.username}</button></li>
          : ''
        }
        {
          (loggedInUser !== null && currentPage === 'profile') || test
          ?
          <li className='nav-bar-item' style={{float:'right'}}><button className='logout-button' onClick={() => buttonPress('logout', true)}>Logout</button></li>
          : ''
        }
        {loggedInUser !== null ? <li className='nav-bar-item' style={{float:'right'}}><NavLink to='messages' className={({ isActive }) => isActive ? activeClassName : undefined}><button className='nav-button' onClick={() => buttonPress('messages')}>Message Board</button></NavLink></li> : ''}
      </ul>
    </div>

  )
}
export default NavBar