// Reference: Adapted from Week 10 tutorial
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, getPosts, getReplies, getReplies2, activatePost, deactivatePost, getReactions, getFollows } from '../data/repository'
import { profanityCheck } from '../fragments/ProfanityChecker'
import BarGraph from '../fragments/BarGraph'
import MessageContext from '../contexts/MessageContext'
import './Admin.css'
// Reference: https://www.npmjs.com/package/react-minimal-pie-chart
import { PieChart } from 'react-minimal-pie-chart'


export default function User() {
  const { id } = useParams()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(null)
  const [replies, setReplies] = useState(null)
  const [replies2, setReplies2] = useState(null)
  const [profanity, setProfanity] = useState({})
  const [profanityReply, setProfanityReply] = useState({})
  const [profanityReply2, setProfanityReply2] = useState({})
  const { message, setMessage } = useContext(MessageContext)

  const [likes, setLikes] = useState({})
  const [likesReply, setLikesReply] = useState({})
  const [likesReply2, setLikesReply2] = useState({})
  const [dislikes, setDislikes] = useState({})
  const [dislikesReply, setDislikesReply] = useState({})
  const [dislikesReply2, setDislikesReply2] = useState({})

  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [postedLikes, setPostedLikes] = useState(0)
  const [postedDislikes, setPostedDislikes] = useState(0)
  const [likesReceived, setLikesReceived] = useState(0)
  const [disikesReceived, setDislikesReceived] = useState(0)


  useEffect(() => {
    loadUser()
    loadPosts()
    loadFollowers()
    // eslint-disable-next-line
  }, [])

  const loadUser = async () => {
    setUser(await getUser(id))
  }

  const loadFollowers = async () => {
    const follows = await getFollows()
    let counter = 0
    let counter2 = 0
    // eslint-disable-next-line
    follows.map((follow) => {
      if (follow.follower === parseInt(id)) {
        counter += 1
        setFollowingCount(counter)
      } else if (follow.following === parseInt(id)) {
        counter2 += 1
        setFollowerCount(counter2)
      }
    }) 
  }
  
  // Loads posts and counts likes for each post
  const loadPosts = async () => {
    const currentReactions = await getReactions()
    const currentPosts = await getPosts(id)
    setPosts(currentPosts)
    const currentReplies = await getReplies(id)
    setReplies(currentReplies)
    const currentReplies2 = await getReplies2(id)
    setReplies2(currentReplies2)

    let post_ids = []
    let reply_ids = []
    let reply2_ids = []
    // Perform profanity checks
    // eslint-disable-next-line
    currentPosts.map((post) => {
      profanityCheck(post.id, post.message, 'post', profanity, setProfanity, profanityReply, setProfanityReply, profanityReply2, setProfanityReply2)
      likes[post.id] = 0
      setLikes(likes)
      dislikes[post.id] = 0
      setDislikes(dislikes)
      post_ids.push(post.id)
    }) 
    // eslint-disable-next-line
    currentReplies.map((reply) => {
      profanityCheck(reply.id, reply.message, 'reply', profanity, setProfanity, profanityReply, setProfanityReply, profanityReply2, setProfanityReply2)
      likesReply[reply.id] = 0
      setLikesReply(likesReply)
      dislikesReply[reply.id] = 0
      setDislikesReply(dislikesReply)
      reply_ids.push(reply.id)
    }) 
    // eslint-disable-next-line
    currentReplies2.map((reply2) => {
      profanityCheck(reply2.id, reply2.message, 'reply2', profanity, setProfanity, profanityReply, setProfanityReply, profanityReply2, setProfanityReply2)
      likesReply2[reply2.id] = 0
      setLikesReply2(likesReply2)
      dislikesReply2[reply2.id] = 0
      setDislikesReply2(dislikesReply2)
      reply2_ids.push(reply2.id)
    }) 
    // Load reaction counts
    let counter = 0
    let counter2 = 0
    let likeReactionCounter = 0
    let dislikeReactionCounter = 0
    // eslint-disable-next-line
    currentReactions.map((reaction) => {
      if (reaction.post_type === 'post' && reaction.reaction === 1) {
        if(post_ids.includes(reaction.post_id)) {likeReactionCounter += 1}
        likes[reaction.post_id] += 1
        setLikes(likes)
      } else if (reaction.post_type === 'post' && reaction.reaction === 0) {
        if(post_ids.includes(reaction.post_id)) {dislikeReactionCounter += 1}
        dislikes[reaction.post_id] += 1
        setDislikes(dislikes)
      } else if (reaction.post_type === 'reply' && reaction.reaction === 1) {
        if(reply_ids.includes(reaction.post_id)) {likeReactionCounter += 1}
        likesReply[reaction.post_id] += 1
        setLikesReply(likesReply)
      } else if (reaction.post_type === 'reply' && reaction.reaction === 0) {
        if(reply_ids.includes(reaction.post_id)) {dislikeReactionCounter += 1}
        dislikesReply[reaction.post_id] += 1
        setDislikesReply(dislikesReply)
      } else if (reaction.post_type === 'reply2' && reaction.reaction === 1) {
        if(reply2_ids.includes(reaction.post_id)) {likeReactionCounter += 1}
        likesReply2[reaction.post_id] += 1
        setLikesReply2(likesReply2)
      } else if (reaction.post_type === 'reply2' && reaction.reaction === 0) {
        if(reply2_ids.includes(reaction.post_id)) {dislikeReactionCounter += 1}
        dislikesReply2[reaction.post_id] += 1
        setDislikesReply2(dislikesReply2)
      }
      setLikesReceived(likeReactionCounter)
      setDislikesReceived(dislikeReactionCounter)
      // Calculate likes user has given to others
      if (reaction.user_id === parseInt(id) && reaction.reaction === 1) {
        counter += 1
        setPostedLikes(counter)
      } else if (reaction.user_id === parseInt(id) && reaction.reaction === 0) {
        counter2 += 1
        setPostedDislikes(counter2)
      }
    })
  }

  const handleDeactivate = async (post, post_type) => {
    if(!window.confirm(`Are you sure you want to block this post?`))
      return
    
    const isDeactivated = await deactivatePost(post.id, post_type)
    if(isDeactivated) {
      await loadPosts()
      setMessage(<>Post has been blocked successfully.</>)
    }
  }

  const handleActivate = async (post, post_type) => {
    if(!window.confirm(`Are you sure you want to unblock this post?`))
      return
    
    const isActivated = await activatePost(post.id, post_type)
    if(isActivated) {
      await loadPosts()
      setMessage(<>Post has been unblocked successfully.</>)
    }
  }

  if(posts === null)
    return null

  return (
    <div>
      {message && <div className='alert alert-success' role='alert'>{message}</div>}
      {user !== null &&
      <h1 className='display-4'>@{user.username}</h1>}
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Visitors</th>
              <th>Followers</th>
              <th>Following</th>
              <th>Likes Given</th>
              <th>Dislikes Given</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>{likesReceived+disikesReceived !== 0 ? 
                    <>{Math.round(likesReceived * 1000.0 / (likesReceived+disikesReceived)) / 10}{'%'}</> : 
                    '100%'}</td>
                {user !== null &&
                <td>{user.visitors}</td>}
                <td>{followerCount}</td>
                <td>{followingCount}</td>
                <td>{postedLikes}</td>
                <td>{postedDislikes}</td>
              </tr> 
          </tbody>
        </table>
      </div>
      <hr/>
      <h1 className='display-5'>Charts</h1>
      <div className='chart-container'>
        <BarGraph width={300} height={300} xAxisHeight={80} barDataKey={'value'} xAxisDataKey={'title'} data={[
            { title: 'Followers', value: followerCount },
            { title: 'Following', value: followingCount }]}/>
        <div className='pie-chart'>
        <p>Likes vs Dislikes (Received)</p>
        {/* Reference: https://www.npmjs.com/package/react-minimal-pie-chart */}
        {/* If no likes or dislikes, display a grey circle */}
        {likesReceived + disikesReceived === 0 ? 
        <PieChart
          data={[
            { title: 'Likes Received', value: 1, color: '#D3D3D3' },
            { title: 'Dislikes Received', value: 0, color: '#FF0000' } ]}/>
        :
        <PieChart
          data={[
            { title: 'Likes Received', value: likesReceived, color: '#00FF00' },
            { title: 'Dislikes Received', value: disikesReceived, color: '#FF0000' } ]}/>
        }
        </div>
        <div className='pie-chart'>
        <p>Likes vs Dislikes (Given)</p>
        {/* If no likes or dislikes, display a grey circle */}
        { postedLikes + postedDislikes === 0 ? 
        <PieChart
          data={[
            { title: 'Likes Given', value: 1, color: '#D3D3D3' },
            { title: 'Dislikes Given', value: 0, color: '#FF0000' } ]}/>
        :        
        <PieChart
          data={[
            { title: 'Likes Given', value: postedLikes, color: '#00FF00' },
            { title: 'Dislikes Given', value: postedDislikes, color: '#FF0000' } ]}/>
        }
        </div>
      </div><br/>
      <hr/>
      {user !== null &&
      <h1 className='display-4'>Posts by @{user.username}</h1>}
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Messsage</th>
              <th>Image</th>
              <th>Likes</th>
              <th>Dislikes</th>
              <th>Post Active</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post =>
              <tr key={post.id}>
                <td>{post.id}</td>
                <td><div className='message-field' dangerouslySetInnerHTML={{ __html: post.message }} /></td>
                <td>{post.image !== null && <img className='message-pic my-1 p-3' src={post.image} alt='message' />}</td>
                <td>{likes[post.id]}</td>
                <td>{dislikes[post.id]}</td>
                <td>{post.postActive.toString()}</td>
                <td> { post.postActive ? 
                    profanity[post.id] && <button className='btn btn-danger' onClick={() => handleDeactivate(post, 'post')}>Block</button> :
                    <button className='btn btn-danger' onClick={() => handleActivate(post, 'post')}>Unblock</button>
                  }</td>
              </tr>
            )}
            {replies !== null && replies.length !== 0 && 
            replies.map(reply =>
              <tr key={reply.id}>
                <td>{reply.id} (reply ID)</td>
                <td>{reply.message}</td>
                <td></td>
                <td>{likesReply[reply.id]}</td>
                <td>{dislikesReply[reply.id]}</td>
                <td>{reply.replyActive.toString()}</td>
                <td>{reply.replyActive ? 
                    profanityReply[reply.id] && <button className='btn btn-danger' onClick={() => handleDeactivate(reply, 'reply')}>Block</button> :
                    <button className='btn btn-danger' onClick={() => handleActivate(reply, 'reply')}>Unblock</button>
                  }</td>
              </tr>
            )}
            {replies2 !== null && replies2 !== undefined && replies2.length !== 0 && 
            replies2.map(reply2 =>
              <tr key={reply2.id}>
                <td>{reply2.id} (reply2 ID)</td>
                <td>{reply2.message}</td>
                <td></td>
                <td>{likesReply2[reply2.id]}</td>
                <td>{dislikesReply2[reply2.id]}</td>
                <td>{reply2.reply2Active.toString()}</td>
                <td>{reply2.reply2Active ? 
                    profanityReply2[reply2.id] && <button className='btn btn-danger' onClick={() => handleDeactivate(reply2, 'reply2')}>Block</button> :
                    <button className='btn btn-danger' onClick={() => handleActivate(reply2, 'reply2')}>Unblock</button>
                  }</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
