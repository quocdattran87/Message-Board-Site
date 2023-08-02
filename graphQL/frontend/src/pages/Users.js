// Reference: Adapted from Week 10 tutorial
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, activateUser, deactivateUser } from '../data/repository'
import MessageContext from '../contexts/MessageContext'

export default function Users() {
  const [users, setUsers] = useState(null)
  const { message, setMessage } = useContext(MessageContext)

  // Load owners.
  useEffect(() => {
    loadUsers()
  }, [])


  const loadUsers = async () => {
    const currentUsers = await getUsers()
    setUsers(currentUsers)
  }

  const handleDeactivate = async (user) => {
    if(!window.confirm(`Are you sure you want to block ${user.username}?`))
      return
    
    const isDeactivated = await deactivateUser(user.id)
    if(isDeactivated) {
      await loadUsers()
      setMessage(<><strong>{user.username}</strong>'s account has been blocked successfully.</>)
    }
  }

  const handleActivate = async (user) => {
    if(!window.confirm(`Are you sure you want to unblock ${user.username}?`))
      return
    
    const isActivated = await activateUser(user.id)
    if(isActivated) {
      await loadUsers()
      setMessage(<><strong>{user.username}</strong>'s account has been unblocked successfully.</>)
    }
  }

  if(users === null)
    return null

  return (
    <div>
      {message && <div className='alert alert-success' role='alert'>{message}</div>}
      <h1 className='display-4'>LAN Users</h1>
      <div className='mb-3'>
      </div>
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Name</th>
              <th>Posts</th>
              <th>Account Active</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user =>
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>
                  {user.posts.length + user.replies.length + user.reply2s.length}
                </td>
                <td>{user.accountActive.toString()}</td>
                <td>
                  <Link className='btn btn-primary' to={`/view-posts/${user.id}`}>View</Link>
                </td>
                <td>
                  { user.accountActive ? <button className='btn btn-danger' onClick={() => handleDeactivate(user)}>Block</button> :
                    <button className='btn btn-danger' onClick={() => handleActivate(user)}>Unblock</button>
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
