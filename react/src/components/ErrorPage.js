import React from 'react'
import '../css/HomePage.css'

const ErrorPage = () => {  

    return (
        <div className='Home-Page'>
            <p>Error</p>
            <p>{React.version}</p>
        </div>
    )
}

export default ErrorPage