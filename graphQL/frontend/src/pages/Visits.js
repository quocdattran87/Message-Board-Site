// Reference: Adapted from Week 10 tutorial
import { useState, useEffect, useContext } from 'react'
import { getDailyVisits } from '../data/repository'
import MessageContext from '../contexts/MessageContext'
import './Admin.css'
import BarGraph from '../fragments/BarGraph'

export default function Visits() {
  const [dailyVisits, setDailyVisits] = useState(null)
  // eslint-disable-next-line
  const { message, setMessage } = useContext(MessageContext)

  // Load owners.
  useEffect(() => {
    loadDailyVisits()
  }, [])


  const loadDailyVisits = async () => {
    const currentDailyVisitors = await getDailyVisits()
    setDailyVisits(currentDailyVisitors)
  }

  if(dailyVisits === null)
    return null

  return (
    <div>
      {message && <div className='alert alert-success' role='alert'>{message}</div>}
      <h1 className='display-4'>LAN Daily Visits</h1>
        <BarGraph width={800} height={600} xAxisHeight={200} data={dailyVisits} barDataKey={'visitors'} xAxisDataKey={'date'} />
      <hr/>
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
          {dailyVisits.map(dailyVisit =>
            <tr key={dailyVisit.date}>
              <td>{dailyVisit.date}</td>
              <td>{dailyVisit.visitors}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
