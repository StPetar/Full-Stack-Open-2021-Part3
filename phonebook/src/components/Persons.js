import React from 'react'

const Persons = ({ person, handleDelete }) => {
  return (
    <div>
      <p>
        {person.name} {person.number}
        <button onClick={handleDelete}>Delete Contact</button>
      </p>
    </div>
  )
}

export default Persons