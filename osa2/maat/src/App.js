import { useState, useEffect } from 'react'
import axios from "axios"

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries<input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const Countries = ({ countries, filter, setNewFilter }) => {
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredCountries.length > 10) {
    return (
      <>
        Too many matches, specify another filter
      </>
    )
  }
  else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {

    return (
      <ShowFiltered countries={filteredCountries} setNewFilter={setNewFilter} />
    )
  }
  else if (filteredCountries.length == 1) {

    return (
      <ShowDetails country={filteredCountries[0]} />
    )
  }
  else {
    return (
      <> No matches</>
    )
  }
}
const ShowFiltered = ({ countries, setNewFilter }) => {
  return (
    countries.map(country => <ShowCountries key={country.cca2} country={country} setNewFilter={setNewFilter} />)
  )
}

const ShowCountries = ({ country, setNewFilter }) => {
  return (
    <>
      <p>{country.name.common} <button onClick={() => setNewFilter(country.name.common)}>Show</button></p>
    </>
  )
}

const ShowDetails = ({ country }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p> area {country.area}</p>
      <Languages country={country} />
      <p><img src={country.flags.png} width="200" x /></p>
    </>

  )
}

const Languages = ({ country }) => {
  return (
    Object.values(country.languages).map(language => <ShowLanguage key={country.cca2} language={language} />)
  )
}

const ShowLanguage = ({ language }) => {
  return (
    <li>{language}</li>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setNewFilter] = useState("")


  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <div>
        <Countries countries={countries} filter={filter} setNewFilter={setNewFilter} />
      </div>
    </div>
  );
}

export default App;
