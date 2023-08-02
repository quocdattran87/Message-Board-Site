// Adapted from week3 example 10 lectorial code
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost, deletePost, editPost, createReply, deleteReply, createReply2, deleteReply2, createReaction, findByUserID, follow, getPosts, getReactions } from '../data/repository'
import moment from 'moment'
import { useQuill } from 'react-quilljs'
import '../css/MessageBoard.css'
import 'quill/dist/quill.snow.css'
import { getTestPosts, getTestReactions } from '../data/testRepository'


const MessageBoard = ({loggedInUser, setLoggedInUser, setFollowID, setCurrentPage, test}) => {
  const [post, setPost] = useState('')
  const [posts, setPosts] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isReplying, setIsReplying] = useState({})
  const [replies, setReplies] = useState({})
  const [isReplying2, setIsReplying2] = useState({})
  const [replies2, setReplies2] = useState({})
  const [errorReplyMessages, setErrorReplyMessages] = useState({})
  const [errorReplyMessages2, setErrorReplyMessages2] = useState({})
  const [isEditingPost, setIsEditingPost] = useState({})
  const [edits, setEdits] = useState({})
  const [errorEditMessages, setErrorEditMessages] = useState({})
  const [editImages, setEditImage] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [likes, setLikes] = useState({})
  const [likesReply, setLikesReply] = useState({})
  const [likesReply2, setLikesReply2] = useState({})
  const [dislikes, setDislikes] = useState({})
  const [dislikesReply, setDislikesReply] = useState({})
  const [dislikesReply2, setDislikesReply2] = useState({})

  const { quill, quillRef } = useQuill()

  const navigate = useNavigate()

  // Load posts and count likes and dislikes
  async function loadPosts() {
    let temp = {}
    let reactions = []
    if (test) {
      temp = getTestPosts()
      reactions = getTestReactions()
    } else {
      temp = await getPosts()
      reactions = await getReactions()

    }
    setPosts(temp)
    // Initialise like counts to 0
    // eslint-disable-next-line
    temp.map((x) => {
      // eslint-disable-next-line
      x.replies.map((reply) => {
        // eslint-disable-next-line
        reply.reply2s.map((reply2) => {
          likesReply2[reply2.id] = 0
          setLikesReply2(likesReply2)
          dislikesReply2[reply2.id] = 0
          setDislikesReply2(dislikesReply2)
        }) 
        likesReply[reply.id] = 0
        setLikesReply(likesReply)
        dislikesReply[reply.id] = 0
        setDislikesReply(dislikesReply)
      })
      likes[x.id] = 0
      setLikes(likes)
      dislikes[x.id] = 0
      setDislikes(dislikes)
    })
    // eslint-disable-next-line
    reactions.map((reaction) => {
      if (reaction.post_type === 'post' && reaction.reaction === 1) {
        likes[reaction.post_id] += 1
        setLikes(likes)
      } else if (reaction.post_type === 'post' && reaction.reaction === 0) {
        dislikes[reaction.post_id] += 1
        setDislikes(dislikes)
      } else if (reaction.post_type === 'reply' && reaction.reaction === 1) {
        likesReply[reaction.post_id] += 1
        setLikesReply(likesReply)
      } else if (reaction.post_type === 'reply' && reaction.reaction === 0) {
        dislikesReply[reaction.post_id] += 1
        setDislikesReply(dislikesReply)
      } else if (reaction.post_type === 'reply2' && reaction.reaction === 1) {
        likesReply2[reaction.post_id] += 1
        setLikesReply2(likesReply2)
      } else if (reaction.post_type === 'reply2' && reaction.reaction === 0) {
        dislikesReply2[reaction.post_id] += 1
        setDislikesReply2(dislikesReply2)
      }
    })

  }

  useEffect(() => {
      loadPosts()
      // eslint-disable-next-line
      }, [])

  // Reference: https://www.npmjs.com/package/react-quilljs
  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        setPost(quillRef.current.firstChild.innerHTML)
      })
    }
  // eslint-disable-next-line
  }, [quill])

  const handleSubmit = async (event) => {
    event.preventDefault()

    // let temp = post
    // const postTrimmed = temp.replace(/<(.|\n)*?>/g, '').trim()
    if(post.trim() === '' && !selectedImage) {
      setErrorMessage('A post cannot be empty.')
      return
    }
    if(post.trim().length >= 600) {
      setErrorMessage('A post cannot exceed 600 characters.')
      return
    }

    // Add new post into database
    await createPost(loggedInUser.id, post, selectedImage, setPosts)
    loadPosts()

    // Reset post content.
    quill.setText('')
    setPost('')
    setErrorMessage('')
    setSelectedImage(null)
  }


  // Input handling for replies------------------------------------------------
  const handleReplyInputChange = (event,id) => {
    let updatedValue = {}
    updatedValue[id] = event.target.value
    setReplies(replies => ({
         ...replies,
         ...updatedValue
    }))
  }

  const handleReplySubmit = async (event,id) => {
    event.preventDefault()
    if (replies[id] === undefined) { // Initialise a reply item for each thread
      replies[id] = ''
      setReplies(replies)
    }
  
    const replyTrimmed = replies[id].trim();
    if (replyTrimmed === '') { // Error handling
      let updatedError = {}
      updatedError[id] = 'A reply cannot be empty.'
      setErrorReplyMessages(errorReplyMessages => ({
           ...errorReplyMessages,
           ...updatedError
      }))
      return
    }
    if (replyTrimmed.length >= 600) {
      let updatedError = {}
      updatedError[id] = 'A reply cannot exceed 600 characters.'
      setErrorReplyMessages(errorReplyMessages => ({
           ...errorReplyMessages,
           ...updatedError
      }))
      return
    }

    // Save replies. This adds it to the post in local storage and updates the posts state
    await createReply(id, loggedInUser, replyTrimmed, setPosts)
    loadPosts()

    // Reset reply content
    let updatedReply = {}
    updatedReply[id] = ''
    setReplies(replies => ({
         ...replies,
         ...updatedReply
    }))
    // Reset error message
    let updatedError = {}
    updatedError[id] = ''
    setErrorReplyMessages(errorReplyMessages => ({
         ...errorReplyMessages,
         ...updatedError
    }))
    let updatedValue = {}
    updatedValue[id] = false
    setIsReplying(isReplying => ({
          ...isReplying,
          ...updatedValue
    }))
  }

  function cancelReply(event, id) {
    if (event) event.preventDefault()
    let updatedValue = {}
    updatedValue[id] = false
    setIsReplying(isReplying => ({
          ...isReplying,
          ...updatedValue
    }))
    let updatedError = {}
    updatedError[id] = ''
    setErrorReplyMessages(errorReplyMessages => ({
         ...errorReplyMessages,
         ...updatedError
    }))
    let updatedReply = {}
    updatedReply[id] = ''
    setReplies(replies => ({
         ...replies,
         ...updatedReply
    }))
  }

  function reply1Pressed(id) {
    let updatedValue = {}
    updatedValue[id] = true
    setIsReplying(isReplying => ({
          ...isReplying,
          ...updatedValue
    }))
  }


    // Input handling for replies of replies------------------------------------------------
    const handleReplyInputChange2 = (event,id) => {
      let updatedValue = {}
      updatedValue[id] = event.target.value
      setReplies2(replies2 => ({
           ...replies2,
           ...updatedValue
      }))
    }
  
    const handleReplySubmit2 = async (event,id, parentID) => {
      event.preventDefault()
      if (replies2[id] === undefined) { // Initialise a reply item for each thread
        replies2[id] = ''
        setReplies2(replies2)
      }
    
      const replyTrimmed = replies2[id].trim();
      if (replyTrimmed === '') { // Error handling
        let updatedError = {}
        updatedError[id] = 'A reply cannot be empty.'
        setErrorReplyMessages2(errorReplyMessages2 => ({
             ...errorReplyMessages2,
             ...updatedError
        }))
        return
      }
      if (replyTrimmed.length >= 600) {
        let updatedError = {}
        updatedError[id] = 'A reply cannot exceed 600 characters.'
        setErrorReplyMessages2(errorReplyMessages2 => ({
             ...errorReplyMessages2,
             ...updatedError
        }))
        return
      }
  
      // Save replies. This adds it to the post in local storage and updates the posts state
      await createReply2(id, loggedInUser, replyTrimmed, setPosts)
      loadPosts()
  
      // Reset reply content
      let updatedReply = {}
      updatedReply[id] = ''
      setReplies2(replies2 => ({
           ...replies2,
           ...updatedReply
      }))
      // Reset error message
      let updatedError = {}
      updatedError[id] = ''
      setErrorReplyMessages2(errorReplyMessages2 => ({
           ...errorReplyMessages2,
           ...updatedError
      }))
      let updatedValue = {}
      updatedValue[id] = false
      setIsReplying2(isReplying2 => ({
            ...isReplying2,
            ...updatedValue
      }))
    }
  
    function cancelReply2(event, id) {
      if (event) event.preventDefault()
      let updatedValue = {}
      updatedValue[id] = false
      setIsReplying2(isReplying2 => ({
            ...isReplying2,
            ...updatedValue
      }))
      let updatedError = {}
      updatedError[id] = ''
      setErrorReplyMessages2(errorReplyMessages2 => ({
           ...errorReplyMessages2,
           ...updatedError
      }))
      let updatedReply = {}
      updatedReply[id] = ''
      setReplies2(replies2 => ({
           ...replies2,
           ...updatedReply
      }))
    }
  
    function reply2Pressed(id) {
      let updatedValue = {}
      updatedValue[id] = true
      setIsReplying2(isReplying2 => ({
            ...isReplying2,
            ...updatedValue
      }))
    }


  // Input handling for edits------------------------------------------------
  const handleEditInputChange = (event,id) => {
    let updatedValue = {}
    updatedValue[id] = event.target.value
    setEdits(edits => ({
          ...edits,
          ...updatedValue
    }))
  }

  const handleEditSubmit = (event,post) => {
    event.preventDefault()
    if (edits[post.id] === undefined) { // Initialise a reply item for each thread
      edits[post.id] = ''
      setEdits(edits)
    }
  
    const editTrimmed = edits[post.id].trim();

    if (editTrimmed === '' && editImages[post.id] !== post.image ) { // Error handling
      let updatedError = {}
      updatedError[post.id] = 'A reply cannot be empty.'
      setErrorEditMessages(errorEditMessages => ({
           ...errorEditMessages,
           ...updatedError
      }))
      return
    }
    if (editTrimmed.length >= 600) {
      let updatedError = {}
      updatedError[post.id] = 'A reply cannot exceed 600 characters.'
      setErrorEditMessages(errorEditMessages => ({
           ...errorEditMessages,
           ...updatedError
      }))
      return
    }

    // Save edits. This replaces the old message with the new editedMessage in local storage and updates the posts state
    editPost(post.id, editTrimmed, editImages[post.id], setPosts)

    // Reset reply content
    let updatedEdit = {}
    updatedEdit[post.id] = ''
    setEdits(edits => ({
         ...edits,
         ...updatedEdit
    }))
    // Reset error message
    let updatedError = {}
    updatedError[post.id] = ''
    setErrorEditMessages(errorEditMessages => ({
         ...errorEditMessages,
         ...updatedError
    }))
    let updatedValue = {}
    updatedValue[post.id] = false
    setIsEditingPost(isEditingPost => ({
          ...isEditingPost,
          ...updatedValue
    }))
  }

  // When the edit button is pressed
  function editPostPressed(post) {
    // Set flag for specific post id that editing is true
    let updatedValue = {}
    updatedValue[post.id] = true
    setIsEditingPost(isEditingPost => ({
          ...isEditingPost,
          ...updatedValue
    }))
    // Initialise text value to be original message
    let updatedEdit = {}
    updatedEdit[post.id] = post.message
    setEdits(edits => ({
         ...edits,
         ...updatedEdit
    }))
    // Initialise image to be original image, if any
    if (post.image) {
      let updatedImage = {}
      updatedImage[post.id] = post.image
      setEditImage(editImages => ({
           ...editImages,
           ...updatedImage
      }))
    }
  }

  function handleEditImageButton(image, post) {
    if (image) {
      // Adapted from:
      // https://stackoverflow.com/questions/46040973/how-to-upload-image-using-reactjs-and-save-into-local-storage
      getBase64(image).then(base64 => {
        let updatedImage = {}
        updatedImage[post.id] = base64
        setEditImage(editImages => ({
            ...editImages,
            ...updatedImage
        }))
      })
    } else {
      let updatedImage = {}
        updatedImage[post.id] = undefined
        setEditImage(editImages => ({
            ...editImages,
            ...updatedImage

    }))}
  }

  // https://stackoverflow.com/questions/46040973/how-to-upload-image-using-reactjs-and-save-into-local-storage
  const getBase64 = (file) => {
    return new Promise((resolve,reject) => {
       const reader = new FileReader()
       reader.onload = () => resolve(reader.result)
       reader.onerror = error => reject(error)
       reader.readAsDataURL(file)
    })
  }

  function cancelEdit(event, id) {
    if (event) event.preventDefault()
    let updatedValue = {}
    updatedValue[id] = false
    setIsEditingPost(isEditingPost => ({
          ...isEditingPost,
          ...updatedValue
    }))
    let updatedError = {}
    updatedError[id] = ''
    setErrorEditMessages(errorEditMessages => ({
         ...errorEditMessages,
         ...updatedError
    }))
  }

  async function followUser(user_id) {
    const user = await findByUserID(user_id)
    // If user is yourself
    if (user.username === loggedInUser.username) {
      goToProfile(user_id) 
      return
    }
    for (var i = 0; i < loggedInUser.following.length; i++) {
      // If user is already followed
      if (user.username === loggedInUser.following[i].user.username) {
        goToProfile(user_id)
        return
      }
    }
   
    if (window.confirm('Follow ' + user.username + '?')) {
      follow(loggedInUser.id, user_id, setLoggedInUser)
    }
  }

  function goToProfile(user_id) {
    localStorage.setItem('follow_id', user_id)
    setFollowID(user_id)
    localStorage.setItem('currentPage', 'follow-messages')
    setCurrentPage('follow-messages')
    navigate('/follow-messages', { replace: true })
    return
  }

  async function reaction(post_id, reaction, post_type, postActive) {
    if (postActive) {
      await createReaction(loggedInUser.id, post_id, reaction, post_type)
    }
    loadPosts()
  }

  return (
    <div className='MessageBoard'>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>New Post</legend>
          <div className='form-group'>
            <div ref={quillRef} className='quill' value={post}/>
          </div>
          {errorMessage !== null &&
            <div className='form-group'>
              <span className='text-danger'>{errorMessage}</span>
            </div>
          }
          <div className='form-group2'>
            <input type='submit' className='btn btn-primary' value='Post' />
            <input
              className='file-upload'
              type='file'
              name='myImage'
              onChange={(event) => {
              setSelectedImage(event.target.files[0]);
              }}/>
          </div>
        </fieldset>
      </form>

      <hr />
      <h1>Forum</h1>
      <div className='message-board'>
          {/* Main loop. Loop through all messages and display */}
          { posts === null || posts.length === 0 ?
            <span className='text-muted'>No posts have been submitted.</span>
            :
            posts.map((x) =>
              <div key={x.id} className='border my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                <button className='following' onClick={() => followUser(x.user.id)}><h3 className='post-username text-primary1'>@{x.user.username}</h3></button>
                <label className='message-time-label'>{moment(x.date).fromNow()}</label>
                <button className='dislike-message' style={{float:'right'}} onClick={() => { reaction(x.id,0,'post', x.postActive) }}>
                  {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-down/*/}
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-down' viewBox='0 0 16 16'>
                    <path d='M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z'/>
                  </svg>
                  <p className='dislikes-count-posts'>{dislikes[x.id]}</p>
                </button>
                <button className='like-message' style={{float:'right'}} onClick={() => { reaction(x.id,1,'post', x.postActive) }}>
                  {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-up/*/}
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-up' viewBox='0 0 16 16'>
                    <path d='M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z'/>
                  </svg>
                  <p className='likes-count-posts'>{likes[x.id]}</p>
                </button>
                <br/><br/>
      
                {/* Show editing form if the edit button is pressed */}
                {isEditingPost[x.id] && x.user.username === loggedInUser.username ?
                      <form onSubmit={event => handleEditSubmit(event,x)}>
                      <fieldset>
                        <h2>Edit Post</h2>
                        <div className='form-group'>
                          <textarea name='post' id='post' className='form-control' rows='3'
                            value={edits[x.id]} onChange={event => handleEditInputChange(event,x.id)} />
                          {/* Check to see if there is a previous image to display in edit form */}
                          { editImages[x.id] && 
                            <div>
                              <img className='message-pic my-1 p-3' src={editImages[x.id]} alt='message' />
                            </div>
                          }
                        </div>
                        {errorEditMessages[x.id] !== undefined &&
                          <div className='form-group'>
                            <span className='text-danger'>{errorEditMessages[x.id]}</span>
                          </div>
                        }
                        <div className='form-group3'>
                          <input
                            className='file-upload'
                            type='file'
                            accept='.jpeg, .png, .jpg, .gif'
                            name='myImage'
                            onChange={(event) => {
                              handleEditImageButton(event.target.files[0], x);
                            }}/>
                    
                            <div>
                              <button className='edit-cross' style={{float:'right'}} onClick={event => { cancelEdit(event, x.id) }}>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'>
                                <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
                                </svg>
                              </button>
                              {((editImages[x.id] !== x.image && editImages[x.id] !== undefined ) || (editImages[x.id] === undefined &&  x.image !== null ) || edits[x.id] !== x.message) && <>
                              <button type='submit' className='edit-tick' style={{float:'right'}}><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check' viewBox='0 0 16 16'>
                                <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/>
                                </svg>
                              </button></>
                              }
                            </div>
                        </div>
                      </fieldset>
                    </form> 
                    :
                    <>  
                      <div className='message-border my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                        {!x.postActive ? <div className='message-field' dangerouslySetInnerHTML={{ __html: '[**** This post has been deleted by the admin***\n **** This thread is now closed***]' }} />  :
                          <><div className='message-field' dangerouslySetInnerHTML={{ __html: x.message }} />       
                          { x.image &&
                          <div>
                            <img className='message-pic my-1 p-3' src={x.image} alt='message' />
                          </div>
                          }</>}
                        </div>
                        {x.user.username === loggedInUser.username && (!isReplying[x.id] || isReplying[x.id] === undefined)
                          &&
                          <div className='owner-buttons'>
                          <button className='delete-message' style={{float:'right'}} onClick={() => { deletePost(x.id, setPosts, x.replies) }}>
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash' viewBox='0 0 16 16'>
                              <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
                              <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
                              </svg>
                          </button>
                          {x.postActive && <button className='edit-message' style={{float:'right'}} onClick={() => { editPostPressed(x) }}><i className='glyphicon glyphicon-edit'></i></button>}
                          </div>
                          }</> 
                }
                {
                  /* Show reply button if post.username is different from logged in username */
                  (!isReplying[x.id] || isReplying[x.id] === undefined) && x.postActive &&
                  <div className='form-group'>
                    <input type='button' className='btn btn-primary' value='Reply' onClick={event => reply1Pressed(x.id) } />
                  </div>
                }
                { isReplying[x.id] &&
                  <form onSubmit={event => handleReplySubmit(event,x.id)}>
                    <fieldset>
                      <div className='form-group'>
                        <textarea name='reply' id='reply' className='form-control' rows='1'
                          value={replies[x.id]} onChange={event => handleReplyInputChange(event,x.id)} />
                      </div>
                      {errorReplyMessages[x.id] !== undefined &&
                        <div className='form-group'>
                          <span className='text-danger'>{errorReplyMessages[x.id]}</span>
                        </div>
                      }
                      {/* Show reply tick only when there is text in the field */}
                      <div>
                        <button className='edit-cross' style={{float:'right'}} onClick={event => { cancelReply(event, x.id) }}>
                          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'>
                          <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
                          </svg>
                        </button>
                        {((replies[x.id] !== '') && replies[x.id] !== undefined) &&
                        <button type='submit' className='edit-tick' style={{float:'right'}}><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check' viewBox='0 0 16 16'>
                          <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/>
                          </svg>
                        </button>
                        }
                      </div>
                    </fieldset>
                  </form>
                }

                {/* If a message has replies, loop through and show them */}
                { x.replies.length === 0 ? '' : <>
                  <hr className='line-break'/>
                  <h2>Replies</h2>
                  <div>
                    {x.replies.reverse().map((reply) =>
                      <div key={reply.id} className='reply-border my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                        {reply.message}<br/>
                        <label className='reply-username'>@{reply.username}</label> - <label className='reply-time-label'>{moment(reply.date).fromNow()}</label>
                <button className='dislike-message' style={{float:'right'}} onClick={() => { reaction(reply.id,0,'reply',reply.replyActive) }}>
                  {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-down/*/}
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-down' viewBox='0 0 16 16'>
                    <path d='M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z'/>
                  </svg>
                  <p className='dislikes-count'>{dislikesReply[reply.id]}</p>
                </button>
                <button className='like-message' style={{float:'right'}} onClick={() => { reaction(reply.id,1,'reply',reply.replyActive) }}>
                  {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-up/*/}
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-up' viewBox='0 0 16 16'>
                    <path d='M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z'/>
                  </svg>
                  <p className='likes-count'>{likesReply[reply.id]}</p>
                </button>
     
                    {/* Show reply button if reply.username is different from logged in username */}
                    {(!isReplying2[reply.id] || isReplying2[reply.id] === undefined) &&
                      <div className='form-group'>
                        <input type='button' className='btn btn-primary' value='Reply' onClick={event => reply2Pressed(reply.id) } />
                      </div>
                    }
                                       {reply.username === loggedInUser.username && (!isReplying2[reply.id] || isReplying2[reply.id] === undefined)
                          &&
                          <div className='owner-buttons'>
                          <button className='delete-message' style={{float:'right'}} onClick={() => { deleteReply(reply.id, setPosts, reply.reply2s) }}>
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash' viewBox='0 0 16 16'>
                              <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
                              <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
                              </svg>
                          </button>
                          </div>
                          }
                    { 
                    isReplying2[reply.id] &&
                    <form onSubmit={event => handleReplySubmit2(event,reply.id, x.id)}>
                      <fieldset>
                        <div className='form-group'>
                          <textarea name='reply' id='reply' className='form-control' rows='1'
                            value={replies2[reply.id]} onChange={event => handleReplyInputChange2(event,reply.id)} />
                        </div>
                        {errorReplyMessages2[reply.id] !== undefined &&
                          <div className='form-group'>
                            <span className='text-danger'>{errorReplyMessages2[reply.id]}</span>
                          </div>
                        }
                        {/* Show reply tick only when there is text in the field */}
                        <div>
                          <button className='edit-cross' style={{float:'right'}} onClick={event => { cancelReply2(event, reply.id) }}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'>
                            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
                            </svg>
                          </button>
                          {((replies2[reply.id] !== '') && replies2[reply.id] !== undefined) &&
                          <button type='submit' className='edit-tick' style={{float:'right'}}><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check' viewBox='0 0 16 16'>
                            <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/>
                            </svg>
                          </button>
                          }
                        </div>
                      </fieldset>
                    </form>
                    }
                    {reply.reply2s === undefined || reply.reply2s.length === 0 ? '' : 
                      <div>
                        <br/>
                        {reply.reply2s.reverse().map((reply2) =>
                        
                          <div key={reply2.id} className='reply-border-2 my-3 p-3' style={{ whiteSpace: 'pre-wrap' }}>
                            {reply2.message}<br/>
                            <label className='reply-username'>@{reply2.username}</label> - <label className='reply-time-label'>{moment(reply2.date).fromNow()}</label>
                            <button className='dislike-message' style={{float:'right'}} onClick={() => { reaction(reply2.id,0,'reply2',reply2.reply2Active) }}>
                              {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-down/*/}
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-down' viewBox='0 0 16 16'>
                                <path d='M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z'/>
                              </svg>
                              <p className='dislikes-count'>{dislikesReply2[reply2.id]}</p>
                            </button>
                            <button className='like-message' style={{float:'right'}} onClick={() => { reaction(reply2.id,1,'reply2',reply2.reply2Active) }}>
                              {/*// Reference: https://icons.getbootstrap.com/icons/hand-thumbs-up/*/}
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-hand-thumbs-up' viewBox='0 0 16 16'>
                                <path d='M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z'/>
                              </svg>
                              <p className='likes-count'>{likesReply2[reply2.id]}</p>
                            </button><br/><br/>
                            {reply2.username === loggedInUser.username && (!isReplying2[reply.id] || isReplying2[reply.id] === undefined)
                            &&
                            <div className='owner-buttons'>
                              <br/>
                            <button className='delete-message' style={{float:'right'}} onClick={() => { deleteReply2(reply2.id, setPosts) }}>
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash' viewBox='0 0 16 16'>
                              <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
                              <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
                              </svg>
                            </button>
                            </div>
                            }
                          </div>
                        )}
                      </div>
                    }
                    </div>
                  )}
                  </div>
                  </>
                }
              </div> 
            )
          }
      </div>
    </div>
  )
}

export default MessageBoard
