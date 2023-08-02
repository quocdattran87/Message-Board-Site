import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserPosts, findByUserID, deleteFollow, incrementProfileVisit } from '../data/repository'
import '../css/ProfilePage.css'
import moment from 'moment'

const FollowMessages = ({ loggedInUser, setLoggedInUser, followID, setCurrentPage }) => {  
    const [follow, setFollow] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadPosts() {
          setFollow(await getUserPosts(followID))
        }
        loadPosts()
        incrementProfileVisit(followID)
        // eslint-disable-next-line
        }, [])

    async function unfollow(user_id) {
        const user = await findByUserID(user_id)
        if (window.confirm('Unfollow ' + user.username + '?')) {
            deleteFollow(loggedInUser.id, user_id, setLoggedInUser)
            localStorage.setItem('currentPage', 'profile')
            setCurrentPage('profile')
            navigate('/profile', { replace: true })
        }
    }

    return (
        <div className='MessageBoard'>
            { (follow === null || follow.user.username !== loggedInUser.username) &&
            <div className='form-group'>
                <input type='button' className='btn btn-primary' value='Unfollow' onClick={event => unfollow(followID) } />
            </div>}
            { follow === null || follow.posts === null || follow.posts.length === 0 ? <span className='text-muted'>No posts have been submitted.</span> :
                <div>
                    <h1>Posts by {follow.user.username}</h1>
                    {follow.posts.map((x) =>
                    <div key={x.id} className='border my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                        <h3 className='text-primary1'>@{follow.user.username}</h3>
                        <label className='message-time-label'>{moment(x.date).fromNow()}</label>
                        <div className='message-border my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                          <div dangerouslySetInnerHTML={{ __html: x.message }} />       
                          { x.image &&
                          <div>
                            <img className='message-pic my-1 p-3' src={x.image} alt='message' />
                          </div>
                          }
                        </div>
                    </div>
                    )}
                </div>
            }
            <h1>Replies</h1>
            { follow === null || follow.replies === null || follow.replies.length === 0 ? '' : 
                <div>
                    {follow.replies.reverse().map((reply) =>
                        <div key={reply.id} className='reply-border-2 my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                        {reply.message}<br/>
                        <label className='reply-time-label'>{moment(reply.date).fromNow()}</label>
                        </div>
                    )}
                </div>
            }

            { follow === null || follow.replies2 === null || follow.replies2.length === 0 ? '' : 
                <div>
                    {follow.replies2.reverse().map((reply2) =>
                        <div key={reply2.id} className='reply-border-2 my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                        {reply2.message}<br/>
                        <label className='reply-time-label'>{moment(reply2.date).fromNow()}</label>
                        </div>
                    )}
                </div>
            }
        

        </div>
    )
}

export default FollowMessages