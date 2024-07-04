import React from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../pages/paths'

const Footer = () => {
  return (
    <footer>
      <Link to={paths.Home}>Главная</Link>
      <Link to={paths.Profile}>Профиль</Link>
    </footer>
  )
}

export default Footer
