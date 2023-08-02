// From week3 example 8 lectorial code
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, incrementSiteVisit } from '../data/repository'
import useForm from './useForm'
import validateForm from './FormValidationRules'
import '../css/SignUpPage.css'

const SignUpPage = ( {setLoggedInUser, setCurrentPage}) => {
  const navigate = useNavigate()

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(signup, validateForm, 'signup')

  async function signup() {
    alert('Sign up successful')
    const user = await createUser(values)

    // Add new users to localStorage and update state
    setLoggedInUser(user)
    localStorage.setItem('loggedInUser', JSON.stringify(user))

    incrementSiteVisit()
    // Go to profile
    setCurrentPage('profile')
    localStorage.setItem('currentPage', 'profile')
    navigate('/profile', { replace: true })
  }

  function buttonPress(page) {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
  }

  return (
    <div className='signup-page'>
      <div className='section is-fullheight'>
        <div className='signup-container'>
          <div>
            <h1 className='signup-page-title'>Register account</h1>
          </div>
          <div className='column is-4 is-offset-4'>
            <div className='box'>
              <form onSubmit={handleSubmit} noValidate>
                <div className='field'>
                  <label htmlFor='username-input' className='label'>Username</label>
                  <div className='control'>
                    <input id='username-input' autoComplete='off' className={`input ${errors.username && 'is-danger'}`} type='text' name='username' onChange={handleChange} value={values.username || ''} required />
                    {errors.username && (
                      <p className='help is-danger'>{errors.username}</p>
                    )}
                    {errors.uniqueUsername && (
                      <p className='help is-danger'>{errors.uniqueUsername}</p>
                    )}
                  </div>
                </div>
                <div className='field'>
                  <label htmlFor='first-name-input' className='label'>First Name</label>
                  <div className='control'>
                    <input id='first-name-input' autoComplete='off' className={`input ${errors.firstName && 'is-danger'}`} type='text' name='firstName' onChange={handleChange} value={values.firstName || ''} required />
                    {errors.firstName && (
                      <p className='help is-danger'>{errors.firstName}</p>
                    )}
                  </div>
                </div>
                <div className='field'>
                  <label htmlFor='last-name-input' className='label'>Last Name</label>
                  <div className='control'>
                    <input id='last-name-input' autoComplete='off' className={`input ${errors.lastName && 'is-danger'}`} type='text' name='lastName' onChange={handleChange} value={values.lastName || ''} required />
                    {errors.lastName && (
                      <p className='help is-danger'>{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className='field'>
                  <label htmlFor='email-input' className='label'>Email Address</label>
                  <div className='control'>
                    <input id='email-input' autoComplete='off' className={`input ${errors.email && 'is-danger'}`} type='email' name='email' onChange={handleChange} value={values.email || ''} required />
                    {errors.email && (
                      <p className='help is-danger'>{errors.email}</p>
                    )}
                    {errors.uniqueEmail && (
                      <p className='help is-danger'>{errors.uniqueEmail}</p>
                    )}
                  </div>
                </div>
                <div className='field'>
                  <label htmlFor='password-input' className='label'>Password</label>
                  <div className='control'>
                    <input id='password-input' className={`input ${errors.password && 'is-danger'}`} type='password' name='password' onChange={handleChange} value={values.password || ''} required />
                  </div>
                  {errors.password && (
                    <p className='help is-danger'>{errors.password}</p>
                  )}
                </div>
                <button type='submit' className='button is-block is-info is-fullwidth'>Signup</button>
              </form>
            </div>
          </div>
          <div>
              Already have an account? <b>Login</b> <Link onClick={() => buttonPress('login')} to='/login'>here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
