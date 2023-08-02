import React from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser } from '../data/repository'
import '../css/ProfilePage.css'
import defaultProfilePic from '../images/blank-profile-picture.png'

const ProfilePage = ({ loggedInUser, setLoggedInUser, setCurrentPage, setFollowID }) => {  
    const navigate = useNavigate()

    function deleteProfile() {
        if (window.confirm('Delete account?\nAll posts by this account will also be deleted\nThis cannot be undone')) {
            // Delete account
            deleteUser(loggedInUser.id, setLoggedInUser)
            // Update page
            setCurrentPage('/')
            localStorage.setItem('currentPage', '/')
            navigate('/', { replace: true })
        }
    }

    function editProfile() {
        localStorage.setItem('currentPage', 'edit-profile')
        navigate('/edit-profile')
    }

    function goToUserMessages (user_id) {
        localStorage.setItem('follow_id', user_id)
        setFollowID(user_id)
        localStorage.setItem('currentPage', 'follow-messages')
        setCurrentPage('follow-messages')
        navigate('/follow-messages', { replace: true })
    }


    return (
        <div className='ProfilePage'>
            <div className='border my-3 p-5' style={{ whiteSpace: 'pre-wrap' }}>
                <h3 className='text-primary2'>hi @{loggedInUser.username}</h3>
                <div className='message-border-2 my-3 p-5' style={{ whiteSpace: 'pre-wrap' }}>
                    <div className='container'>
                        <div className='profile-container'>

                            {loggedInUser.profilePic 
                            ? 
                            <img className='profile-pic my-1 p-3' src={loggedInUser.profilePic} alt='profile pic' />
                            :  
                            <img className='profile-pic my-1 p-3' src={defaultProfilePic} alt='empty profile'/>
                            }
                            <div className='profile-information'>
                                <p>{loggedInUser.firstName} {loggedInUser.lastName}</p>
                                <p className='email-text'>{loggedInUser.email}</p>
                                <button className='delete-profile' style={{float:'right'}} onClick={deleteProfile}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash' viewBox='0 0 16 16'>
                                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
                                    <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
                                    </svg>
                                </button>
                                <button aria-label="edit-profile" className='edit-profile' style={{float:'right'}} onClick={editProfile}><i className='glyphicon glyphicon-edit'></i></button>
                            </div>
                            <div className='vl'></div>
                            <div className='following-list'>
                                { loggedInUser.following === undefined || loggedInUser.following.length === 0 
                                ?
                                <p>  Not following any users</p>
                                :
                                <><p><b>  following</b></p>
                                {loggedInUser.following.map((x) =>
                                <div key={x.id} className='followed-user'>
                                    <button className='following' onClick={() => goToUserMessages(x.user.id)}>@{x.user.username}</button>
                                </div>
                                )}
                                </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <label className='message-time-label'>Joined {loggedInUser.date}</label>
            </div>
        </div>
    )
}

export default ProfilePage