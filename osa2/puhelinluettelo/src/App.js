import { useState, useEffect } from 'react'
import personService from './services/persons'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

}
const ConfirmNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  else {
    return (
      <div className='confirm'>
        {message}
      </div>
    )
  }

}

const Filter = ({ newFilter, handleFilterChange }) => (
  <div>
    filter shown with <input value={newFilter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addNewPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handlePersonChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const Persons = ({ persons, filter, setPersons, setConfirmMessage, setErrorMessage }) => {

  if (filter === "") {
    return (
      persons.map(person => <ShowNumbers key={person.id} person={person} setPersons={setPersons} persons={persons} setConfirmMessage={setConfirmMessage} setErrorMessage={setErrorMessage} />)
    )
  }
  else {
    return (
      <ShowFiltered persons={persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))} setPersons={setPersons} setConfirmMessage={setConfirmMessage} setErrorMessage={setErrorMessage} />
    )
  }
}

const ShowNumbers = ({ person, persons, setPersons, setConfirmMessage, setErrorMessage }) =>
  <>
    <p>{person.name} {person.number} <button onClick={() => deletePersons({ person, setPersons, persons, setConfirmMessage, setErrorMessage })}>delete</button></p>
  </>

const deletePersons = ({ person, setPersons, persons, setConfirmMessage, setErrorMessage }) => {
  if (window.confirm(`delete ${person.name}?`)) {
    personService
      .deletePerson(person.id)
      .then(setPersons(persons.filter(p => p.id !== person.id)))
      .then(setConfirmMessage(`Deleted ${person.name}'s number`))
      .then(setTimeout(() => {
        setConfirmMessage(null)
      }, 5000))
      .catch(error => {
        setErrorMessage(`The person ${person.name} was already deleted from server`)
        setConfirmMessage(null)
        setPersons(persons.filter(p => p.id !== person.id))
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)


      }
      )
  }
  else {
    return
  }

}

const ShowFiltered = ({ persons, setPersons, setConfirmMessage, setErrorMessage }) => {
  return (
    persons.map(person => <ShowNumbers key={person.id} person={person} persons={persons} setPersons={setPersons} setConfirmMessage={setConfirmMessage} setErrorMessage={setErrorMessage} />)
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [confirmMessage, setConfirmMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(el => el.name.toLowerCase() === newName.toLowerCase())) {
      const old = persons.find(el => el.name.toLowerCase() === newName.toLowerCase())
      if (window.confirm(`${old.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(old.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== old.id ? person : returnedPerson))
            setNewName("")
            setNewNumber("")
            setConfirmMessage(`Updated ${personObject.name}'s number`)
            setTimeout(() => {
              setConfirmMessage(null)
            }, 5000)
          })
      }
    }


    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          setConfirmMessage(`Added ${personObject.name}`)
          setTimeout(() => {
            setConfirmMessage(null)
          }, 5000)
        })

    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <ConfirmNotification message={confirmMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm addNewPerson={addNewPerson} newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange} handlePersonChange={handlePersonChange} />
      <h2>Numbers</h2>
      <div>
        <Persons persons={persons} filter={newFilter} setPersons={setPersons} setConfirmMessage={setConfirmMessage} setErrorMessage={setErrorMessage} />
      </div>
    </div>
  )

}

export default App