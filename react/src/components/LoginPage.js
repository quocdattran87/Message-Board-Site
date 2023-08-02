// From week3 example 8 lectorial code
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { incrementSiteVisit } from '../data/repository'
import useForm from './useForm'
import validateForm from './FormValidationRules'
import '../css/LoginPage.css'
import speakeasy from 'speakeasy'

const LoginPage = ({ setLoggedInUser, setCurrentPage }) => {
  const navigate = useNavigate()
  const [enter2FA, setEnter2FA] = useState(false)
  const [twoFactorError, setTwoFactorError] = useState(null)

  // useForm hook with the 'login' parameter passed in
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(login, validateForm, 'login')

  function login() {
    // Account must be active to log in
    if (!JSON.parse(localStorage.getItem('loggedInUser')).accountActive) {
      alert("'"+ JSON.parse(localStorage.getItem('loggedInUser')).username + "' is not active. Please wait for an administrator to activate your account.")
      return
    }
    // If an account has two factor enabled, show the 2FA screen
    if(JSON.parse(localStorage.getItem('loggedInUser')).twoFactorAuthentication !== null) {
      setEnter2FA(true)
    }
    else {
      // 2FA not active, log in regularly
      goToProfilePage()
    }
  }

  // Reference: https://www.youtube.com/watch?v=6mxA9Zp8600&ab_channel=Omnidev
  // When user submits 2FA token.
  function verify2FA(userToken) {
    var verified = speakeasy.totp.verify({
        secret: JSON.parse(localStorage.getItem('loggedInUser')).twoFactorAuthentication,
        encoding: 'ascii',
        token: userToken
    })
    if (verified) {
        goToProfilePage()
    } else {
        setTwoFactorError('Incorrect token')
        values.twoFactorCode = ''
    }
  }

  function goToProfilePage() {
    alert('Welcome, ' + JSON.parse(localStorage.getItem('loggedInUser')).username + '!')
    incrementSiteVisit()
    setLoggedInUser(JSON.parse(localStorage.getItem('loggedInUser')))
    setCurrentPage('profile')
    localStorage.setItem('currentPage', 'profile')
    navigate('/profile', { replace: true })

  }

  // Go to signup when the text is clicked
  function buttonPress(page) {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
  }


  return (
    <div className='login-page'>
      <div className='section is-fullheight'>
      {!enter2FA &&
        <div className='login-container'>
          <div>
            <h1 className='signup-page-title'>Login</h1>
          </div>
          <div className='column is-4 is-offset-4'>
            <div className='box'>
              <form onSubmit={handleSubmit} noValidate>
                <div className='field'>
                  <label className='label'>Email Address</label>
                  <div className='control'>
                    <input autoComplete='off' className={`input ${errors.email && 'is-danger'}`} type='email' name='email' onChange={handleChange} value={values.email || ''} required />
                    {errors.email && (
                      <p className='help is-danger'>{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Password</label>
                  <div className='control'>
                    <input className={`input ${errors.password && 'is-danger'}`} type='password' name='password' onChange={handleChange} value={values.password || ''} required />
                  </div>
                  {errors.password && (
                    <p className='help is-danger'>{errors.password}</p>
                  )}
                  {errors.login && (
                    <p className='help is-danger'>{errors.login}</p>
                  )}
                </div>
                <button type='submit' className='button is-block is-info is-fullwidth'>Login</button>
              </form>
            </div>
          </div>
          <div>
          <span className='form-input-login'>
            Don't have an account? <b>Sign up</b> <Link onClick={() => buttonPress('signup')} to='/signup'>here</Link>
          </span>
        </div>
        </div>}

        {/* Two Factor Authentication Page */}
        {enter2FA &&
          <div className='login-container'>
          <div className='column is-4 is-offset-4'>
            <div className='box'>
            <h1 className='signup-page-title'>2FA token</h1>
            <p>Enter your 2FA token from Google Authenticator app</p><br/>
            <div className='control'>
            <input type='text' className='input' name='twoFactorCode' onChange={handleChange} value={values.twoFactorCode || ''} required />
            </div>
            {twoFactorError && (<p className='help is-danger'>{twoFactorError}</p>)}<br/><br/>
            <button type='2fa' className='button is-block is-info is-fullwidth' onClick={()=>verify2FA(values.twoFactorCode)}>Login</button>
          </div>
          </div>
          </div>
        }
      </div>
    </div>
  )
}

export default LoginPage
