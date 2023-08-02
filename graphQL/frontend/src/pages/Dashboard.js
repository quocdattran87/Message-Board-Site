import { useState, useEffect, useContext } from 'react'
import MessageContext from '../contexts/MessageContext'
import { dislike, resetDislikes, getDislikes } from '../data/repository'

export default function Dashboard() {
  const { message, setMessage } = useContext(MessageContext)
  const [ dislikes, setDislikes ] = useState(0)


  // --------------Subscription----------------------------------------------------------------------
  // Reference: https://www.the-guild.dev/graphql/yoga-server/docs/features/subscriptions
  const url = new URL('http://localhost:4000/graphql')

  url.searchParams.append(
  'query',
  /* GraphQL */ `
    subscription Test {
      post {
        mutation
        data {
          id
          dislikes
        }
      }
    }
  `
  )
  url.searchParams.append('variables', JSON.stringify({ from: 10 }))
  
  const eventsource = new EventSource(url.href, {
    withCredentials: true // This is required for cookies
  })
  
  eventsource.onmessage = (event) => {
    // const data = JSON.parse(event.data)
    // console.log(data)
    setMessage(<>My spidey senses are tingling!</>)
  }
  // --------------End Subscription----------------------------------------------------------------------

  
  useEffect(() => {
    loadDislikes()
    // eslint-disable-next-line
  }, [])

  const loadDislikes = async () => {
    setDislikes(await getDislikes())
  }
  function dislikePressed() {
    dislike()
    loadDislikes()
  }
  function resetPressed() {
    resetDislikes()
    loadDislikes()
  }

  return (
    <div className='Dash-Page'>
      {message && <div className='alert alert-success' role='alert'>{message}</div>}
      <h1 className='display-4'>Dashboard</h1>
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>With Great Power Comes Great Responsibility</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td><button className='btn btn-danger' onClick={() => dislikePressed()}>Dislike</button></td>
                <td><button className='btn btn-primary' onClick={() => resetPressed()}>Reset</button></td>
                <td>{dislikes}</td>
              </tr>
          </tbody>
        </table>
      </div> 
    </div>
  )
}
