import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './fragments/Navbar'
import Footer from './fragments/Footer'
import Users from './pages/Users'
import User from './pages/User'
import MessageContext from './contexts/MessageContext'
import Visits from './pages/Visits'
import Dashboard from './pages/Dashboard'


export default function App() {
  const [message, setMessage] = useState(null);

  // Set message to null automatically after a period of time.
  useEffect(() => {
    if(message === null)
      return

    const id = setTimeout(() => setMessage(null), 5000);

    // When message changes clear the queued timeout function.
    return () => clearTimeout(id);
  }, [message])

  return (
    <div className='d-flex flex-column min-vh-100'>
      <MessageContext.Provider value={{ message, setMessage }}>
        <Router>
          <Navbar />
          <main role='main'>
            <div className='container my-3'>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/users' element={<Users />} />
                <Route path='/daily-visits' element={<Visits />} />
                <Route path='/view-posts/:id' element={<User />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
      </MessageContext.Provider>
    </div>
  )
}
