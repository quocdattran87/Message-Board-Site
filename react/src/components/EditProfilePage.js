import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { editUser,updateTwoFactorSecret } from '../data/repository'
import useForm from './useForm'
import validateForm from './FormValidationRules'
import '../css/ProfilePage.css'
import defaultProfilePic from '../images/blank-profile-picture.png'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

const EditProfilePage = ({ loggedInUser, setLoggedInUser }) => {  
    const [selectedImage, setSelectedImage] = useState(null)
    const [twoFactorPressed, setTwoFactorPressed] = useState(false)
    const [twoFactorError, setTwoFactorError] = useState(null)
    const [secret, setSecret] = useState(null)
    const [QR, setQR] = useState(null)
    const navigate = useNavigate()
    const [id, setId] = useState(null)

    const {
        values,
        errors,
        setValues,
        handleChange,
        handleSubmit,
    } = useForm(edit, validateForm, 'edit', loggedInUser)


    useEffect(() => {
        async function prePopulateForm() {
            const temp = { }
            setId(loggedInUser.id)
            temp.username = loggedInUser.username
            temp.email = loggedInUser.email
            temp.firstName = loggedInUser.firstName
            temp.lastName = loggedInUser.lastName
            if (loggedInUser.profilePic !== null) {
                temp.profilePic = loggedInUser.profilePic
            }
            setValues(temp)
        }
        prePopulateForm()
        // eslint-disable-next-line
        }, [])

    async function edit() {
        editUser(id, values, setLoggedInUser, selectedImage)
        localStorage.setItem('currentPage', 'profile')
        navigate('/profile', { replace: true })
    }

    function cancelEdit(event) {
        // Stop 'Form submission canceled because the form is not connected' error
        if (event) event.preventDefault()
        localStorage.setItem('currentPage', 'profile')
        navigate('/profile')
    }

    function show2FA(event) {
        if (event) event.preventDefault()
        setTwoFactorPressed(true)

        // Reference: https://www.youtube.com/watch?v=6mxA9Zp8600&ab_channel=Omnidev
        var secret = speakeasy.generateSecret({
            name: 'Loop Agile Now'
        })
        setSecret(secret)

        qrcode.toDataURL(secret.otpauth_url, function(err, data) {
            setQR(data)
        })
    }

    function verify2FA(userToken) {
        // Reference: https://www.youtube.com/watch?v=6mxA9Zp8600&ab_channel=Omnidev
        var verified = speakeasy.totp.verify({
            secret: secret.ascii,
            encoding: 'ascii',
            token: userToken
        })

        if (verified) {
            updateTwoFactorSecret(id, setLoggedInUser, secret.ascii)
            alert('Updated two factor authentication')
            setTwoFactorPressed(false)

        } else {
            setTwoFactorError('Incorrect token')
            values.twoFactorCode = ''
        }
    }

    function cancel2FA() {
        setTwoFactorPressed(false)
        setTwoFactorError('')
        values.twoFactorCode = ''
    }
    
    return (
        <div className='ProfilePage'>
            <div className='border my-3 p-5' style={{ whiteSpace: 'pre-wrap' }}>
                <h3 className='text-primary2'>Edit Profile</h3>
                <div className='message-border-2 my-3 p-5' style={{ whiteSpace: 'pre-wrap' }}>


                {!twoFactorPressed ? <div className='profile-container'>
                    <div className='edit-profile-left'>
                        {selectedImage 
                            ? 
                            <img className='profile-pic my-1 p-3' src={URL.createObjectURL(selectedImage)} alt='profile pic' />
                            :  
                            <>{loggedInUser.profilePic
                                    ? 
                                    <img className='profile-pic my-1 p-3' src={loggedInUser.profilePic} alt='profile pic' />
                                    :  
                                    <img className='profile-pic my-1 p-3' src={defaultProfilePic} alt='empty profile'/>
                                }</>
                            }
                            <input
                                type='file'
                                name='myImage'
                                accept='.jpeg, .png, .jpg, .gif'
                                onChange={(event) => {
                                setSelectedImage(event.target.files[0])
                                }}
                            />
                        </div>
                        <div className='edit-profile-information'>
                            <form onSubmit={event => handleSubmit(event)} noValidate>
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

                                {/* Show two factor authentication button if it is not already active  */}
                                {loggedInUser.twoFactorAuthentication === null || loggedInUser.twoFactorAuthentication === undefined ? <button style={{float:'left'}} onClick={show2FA}>Enable 2FA</button> :  
                                <p className='two-factor-enabled-text'>Two factor authentication enabled</p> }

                                <button aria-label='edit-cancel' className='edit-cross' style={{float:'right'}} onClick={cancelEdit}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'>
                                    <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
                                    </svg>
                                </button>
                            {/* Show tick only when there is a change */}
                            {(values.username !== loggedInUser.username || values.email !== loggedInUser.email || selectedImage || values.firstName !== loggedInUser.firstName || values.lastName !== loggedInUser.lastName) &&
                                <button type='submit' className='edit-tick' style={{float:'right'}}><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check' viewBox='0 0 16 16'>
                                    <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/>
                                    </svg>
                                </button>
                            }
                            </form>
                        </div>
                    </div> :

                    
                    <div className='twofactor-container'>{/* When the enable two factor authentication button is pressed
                        Show the scannable QR code */}
                    <img className='qr' src={QR} alt='QR scan'/>
                        <p>Scan the QR code with google authenticator and input code to enable 2FA</p><br/>
                        <input type='text' name='twoFactorCode' onChange={handleChange} value={values.twoFactorCode || ''} required />
                        {twoFactorError && (
                                <p className='help is-danger'>{twoFactorError}</p>
                                )}
                        <button className='edit-cross' style={{float:'right'}} onClick={cancel2FA}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'>
                            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
                            </svg>
                        </button>
                        {(values.twoFactorCode !== '' && values.twoFactorCode !== undefined) &&
                        <button type='save-2fa' className='edit-tick' style={{float:'right'}} onClick={()=>verify2FA(values.twoFactorCode)}><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check' viewBox='0 0 16 16'>
                            <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/>
                            </svg>
                        </button>
                    }</div>}
                </div>
                <label className='message-time-label'>Joined {loggedInUser.date}</label>
            </div>
        </div>
    )
}

export default EditProfilePage