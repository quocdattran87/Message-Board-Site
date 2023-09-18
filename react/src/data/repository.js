// Reference: Adapted from Week 8 tutorial
import axios from 'axios'

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = 'http://localhost:4002'
const USER_KEY = 'loggedInUser'

// --- Admin ---------------------------------------------------------------------------------------
async function incrementSiteVisit() {
  var options = { year: 'numeric', month: 'long', day: 'numeric' }
  var date  = new Date().toLocaleDateString('en-US', options)
  await axios.put(API_HOST + `/api/admin/visit/${date}`)
}

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
  const response = await axios.get(API_HOST + '/api/users/login', { params: { email, password } })
  const user = response.data
  
  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if(user !== null) {
    setUser(user)
    return true
  } else {
    return false
  }
}

async function findByUserID(id) {
  const response = await axios.get(API_HOST + `/api/users/select_id/${id}`)
  return response.data
}

async function findByUsername(username) {
    const response = await axios.get(API_HOST + `/api/users/select_username/${username}`)
    return response.data
}

async function findByEmail(email) {
    const response = await axios.get(API_HOST + `/api/users/select_email/${email}`)
    return response.data
  }

async function createUser(user) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  var date  = new Date().toLocaleDateString('en-US', options)
  let newUser = { username: user.username.toLowerCase(),
                  firstName: capitalise(user.firstName.toLowerCase()),
                  lastName: capitalise(user.lastName.toLowerCase()),
                  email: user.email.toLowerCase(), 
                  password: user.password, 
                  date: date}
  const response = await axios.post(API_HOST + '/api/users', newUser)
  return response.data
}

async function editUser(id, values, setLoggedInUser, image) {
  let imageBase64 = null
  if (image !== null) {
      await getBase64(image).then(base64 => {
        imageBase64 = base64
      })
  } else if (values.profilePic) {
    imageBase64 = values.profilePic
  }
  let updatedUserInfo = { username: values.username.toLowerCase(),
                          firstName: capitalise(values.firstName.toLowerCase()),
                          lastName: capitalise(values.lastName.toLowerCase()),
                          email: values.email.toLowerCase(),
                          profilePic: imageBase64 }
  await axios.put(API_HOST + `/api/users/${id}`, updatedUserInfo)
  const updatedUser = await findByUserID(id)
  setLoggedInUser(updatedUser)
  localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
}

async function updateTwoFactorSecret(id, setLoggedInUser, secret) {
  const response = await axios.put(API_HOST + `/api/users/2fa/${id}`, {twoFactorAuthentication: secret})
  setLoggedInUser(response.data)
  localStorage.setItem('loggedInUser', JSON.stringify(response.data))
}

async function incrementProfileVisit(id) {
  await axios.put(API_HOST + `/api/users/visit/${id}`)
}

async function deleteUser(id, setLoggedInUser) {
  deleteReactionByUserID(id)
  await axios.delete(API_HOST + `/api/users/delete/${id}`)
  setLoggedInUser(null)
  localStorage.removeItem('loggedInUser') // Update local storage for loggedInUser to be no one
}

async function follow(followerID, followingID, setLoggedInUser) {
  const body = {follower: followerID, following: followingID}
  await axios.post(API_HOST + '/api/follows/', body)
  const updatedUser = await findByUserID(followerID)
  setLoggedInUser(updatedUser)
  localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
}

async function deleteFollow(followerID, followingID, setLoggedInUser) {
  await axios.delete(API_HOST + `/api/follows/delete/${followerID}${followingID}`)
  // Update loggedInUser to reflect follow list
  const updatedUser = await findByUserID(followerID)
  setLoggedInUser(updatedUser)
  localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
}


// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
  const response = await axios.get(API_HOST + '/api/posts')
  return response.data
}

async function getUserPosts(id) {
  const response = await axios.get(API_HOST + `/api/posts/${id}`)
  return response.data
}

async function createPost(user_id, message, image, setPosts) {
  let imageBase64 = null
  if (image !== null) {
    await getBase64(image).then(base64 => {
      imageBase64 = base64
    })
  }
  const post = { user_id: user_id, message: message, image: imageBase64 }
  await axios.post(API_HOST + '/api/posts', post)
  setPosts(await getPosts())
}

async function editPost(id, updatedMessage, updatedImage, setPosts) {
  let image = null
  if (updatedImage) {
    image = updatedImage
  } 
  await axios.put(API_HOST + `/api/posts/${id}`, { message: updatedMessage, image: image })
  setPosts(await getPosts())
}

async function deletePost(id, setPosts, replies) {
  if (window.confirm('Delete post?\nThis cannot be undone')) {
    // eslint-disable-next-line
    replies.map((reply) => {
      // eslint-disable-next-line
      reply.reply2s.map((reply2) => {
        deleteReactionByReply2ID(reply2.id)
      }) 
      deleteReactionByReplyID(reply.id)
    }) 
    deleteReactionByPostID(id)
    await axios.delete(API_HOST + `/api/posts/delete/${id}`)
    setPosts(await getPosts())
  }
}


// --- Replies ------------------------------------------------------------------------------------
async function createReply(post_id, loggedInUser, message, setPosts) {
  const reply = { post_id: post_id, user_id: loggedInUser.id, message: message, username: loggedInUser.username}
  await axios.post(API_HOST + '/api/replies', reply)
  // Update posts to load replies
  setPosts(await getPosts())
}

async function deleteReply(id, setPosts, replies) {
  if (window.confirm('Delete reply?\nThis cannot be undone')) {
    // Delete all reactions in any replies to this post because there is no foreign key
    // eslint-disable-next-line
    replies.map((reply) => {
      deleteReactionByReply2ID(reply.id)
    }) 
    // Delete reactions to this reply
    deleteReactionByReplyID(id)
    await axios.delete(API_HOST + `/api/replies/delete/${id}`)
    setPosts(await getPosts())
  }
}

async function createReply2(reply_id, loggedInUser, message, setPosts) {
  const reply = { reply_id: reply_id, user_id: loggedInUser.id, message: message, username: loggedInUser.username}
  await axios.post(API_HOST + '/api/replies2', reply)
  // Update posts to load replies
  setPosts(await getPosts())
}

async function deleteReply2(id, setPosts) {
  if (window.confirm('Delete reply?\nThis cannot be undone')) {
    deleteReactionByReply2ID(id)
    await axios.delete(API_HOST + `/api/replies2/delete/${id}`)
    setPosts(await getPosts())
  }
}


// --- Reactions ------------------------------------------------------------------------------------
async function getReactions() {
  const response = await axios.get(API_HOST + '/api/reactions')
  return response.data
}

async function createReaction(user_id, post_id, reaction, post_type) {
  const body = { user_id: user_id, post_id: post_id, reaction: reaction, post_type: post_type }
  const response = await axios.post(API_HOST + '/api/reactions', body)
  return response
}

async function deleteReactionByPostID(post_id) {
  const response =  await axios.delete(API_HOST + `/api/reactions/deleteAllByPost/${post_id}`)
  return response
}

async function deleteReactionByReplyID(post_id) {
  const response =  await axios.delete(API_HOST + `/api/reactions/deleteAllByReply/${post_id}`)
  return response
}

async function deleteReactionByReply2ID(post_id) {
  const response =  await axios.delete(API_HOST + `/api/reactions/deleteAllByReply2/${post_id}`)
  return response
}

async function deleteReactionByUserID(user_id) {
  const response =  await axios.delete(API_HOST + `/api/reactions/deleteAllByUser/${user_id}`)
  return response
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

const capitalise = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export {
  verifyUser, findByUserID, findByUsername, findByEmail, createUser, editUser, updateTwoFactorSecret, deleteUser,
  getPosts, createPost, editPost, deletePost, getUserPosts, createReaction, getReactions,
  createReply, deleteReply, createReply2, deleteReply2,
  getUser, removeUser, follow, deleteFollow,
  incrementProfileVisit, incrementSiteVisit
}
