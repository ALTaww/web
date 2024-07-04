import React, { useState } from 'react'
import SearchInput from './MyInput'

const TripSearch = () => {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [when, setWhen] = useState('')

  const searchTrip = () => {
    if (from && to && isDate(when)) {
      console.log('search trip')
    } else {

    }
  }

  function isDate(str) {
    const date = new Date(str)
    return !isNaN(date.getTime())
  }

  return (
    <form id='trip-search'>
      <SearchInput placeholder={'Откуда'}
        id='direction-from'
        aria-label='Введите начальный пункт направления'
        value={from} onChange={(e) => setFrom(e.target.value)}
        />
        <label className='fake' for='direction-from'>Откуда</label>
        <SearchInput placeholder={'Куда'}
        id='direction-to'
        aria-label='Введите конечный пункт'
        value={to} onChange={(e) => setTo(e.target.value)}
        />
        <label className='fake' for='direction-to'>Куда</label>
        <SearchInput type='date' placeholder='Когда'
          value={when} onChange={(e) => setWhen(e.target.value)}
        />
        <button type='submit' onClick={() => searchTrip()} className='find-trip'>Найти</button>
      </form>
  )
}

export default TripSearch