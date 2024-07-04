import React from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../pages/paths'

const Header = () => {
  return (
    <header>
        <Link to={paths.Home}>Главная</Link>
        <Link to={paths.Profile}>Profile</Link>
        <Link to={paths.Searchresults}>Search</Link>
        <Link to={paths.Booking}>Booking</Link>
        <Link to={paths.Login}>Login</Link>
        <Link to={paths.Registration}>Registration</Link>
    </header>
  )
}

export default Header
