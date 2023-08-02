// Reference: https://www.geeksforgeeks.org/create-a-bar-chart-using-recharts-in-reactjs/
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function BarGraph({ width, height, xAxisHeight, data, barDataKey, xAxisDataKey }) {

  if(data === null)
    return null

  return (
    <div>
      <div className='bar-graph'>
        {/* Reference: https://www.geeksforgeeks.org/create-a-bar-chart-using-recharts-in-reactjs/ */}
        <BarChart width={width} height={height} data={data}>
          <Bar dataKey={barDataKey} fill='green' />
          <CartesianGrid stroke='' />
          <XAxis dataKey={xAxisDataKey} tick={{ angle: 90, textAnchor: 'start', 'dominantBaseline': 'ideographic' }} height={xAxisHeight} interval={0}/>
          <YAxis />
        </BarChart>
      </div>
    </div>
  )
}
