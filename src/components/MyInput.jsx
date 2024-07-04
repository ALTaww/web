import React from 'react'

const SearchInput = (props) => {
  return (
    <input type={props.type || 'text'} placeholder={props.placeholder || ''}
        className={props.className || 'search-input'}
        required
        {...props}
    />
  )
}

export default SearchInput
