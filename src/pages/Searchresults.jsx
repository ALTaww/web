import React from 'react'
import HomeSearch from '../components/TripSearch'

const Searchresults = () => {
  return (
    <>
      <HomeSearch/>
      <div className='container'>
        <div className='searchresults-container'>
          <div className='info-container'>
            <span className='driver-name'>Имя Водителя</span>
            <span className='free-places'>5 мест</span>
          </div>
          <div className='info-container'>
            <span className='price'>500 руб.</span>
          </div>
          <div className='info-container driver-info'>
            <span className='mobile'>8912-786-10-09</span>
            <a className='vk' href='https://vk.com/altaww'>Вконтакте</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Searchresults
