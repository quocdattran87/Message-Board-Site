import React from 'react'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/common/NavBar'
import Footer from './components/common/Footer'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'
import LogOutPage from './components/LogOutPage'
import ProfilePage from './components/ProfilePage'
import MessageBoard from './components/MessageBoard'
import ErrorPage from './components/ErrorPage'
import ScrollToTop from './components/ScrollToTop'
import EditProfilePage from './components/EditProfilePage'
import FollowedMessages from './components/FollowedMessages'

import { getUser } from './data/repository'



const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(getUser())
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage'))
  const [followID, setFollowID] = useState(localStorage.getItem('follow_id'))


  return (
    <BrowserRouter>
      <div className='App'>
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
        <ScrollToTop>
        <Routes>
          <Route path="/" element={<HomePage loggedInUser={loggedInUser}/>} />
          <Route path="about" element={<AboutPage/>} />
          <Route path="contact" element={<ContactPage/>} />
          <Route path="login" element={<LoginPage setLoggedInUser={setLoggedInUser} setCurrentPage={setCurrentPage}/>} />
          <Route path="signup" element={<SignUpPage setLoggedInUser={setLoggedInUser} setCurrentPage={setCurrentPage}/>} />
          <Route path="profile" element={<ProfilePage setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser} setCurrentPage={setCurrentPage} setFollowID={setFollowID}/>} />
          <Route path="messages" element={<MessageBoard loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setFollowID={setFollowID} setCurrentPage={setCurrentPage} />} />
          <Route path="edit-profile" element={<EditProfilePage setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser} />} />
          <Route path="follow-messages" element={<FollowedMessages loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} followID={followID} setCurrentPage={setCurrentPage} />} />
          <Route path="logout" element={<LogOutPage/>} />
          <Route path="*" element={<ErrorPage/>} />
        </Routes> 
        </ScrollToTop>
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    </BrowserRouter>
  )
}

export default App
