import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [allActivities, setAllActivities] = useState([])

  useEffect(() => {
    axios.get(`/activities`, {})
      .then((response) => {
        console.log(response.data["activities"])
        setAllActivities(response.data["activities"])
      })
      .catch((error) => {
        console.log(error)
      })

    // axios.post(`/users`, data, {})
    //   .then((response) => {
    //     console.log(response)

    //   })
    //   .catch((error) => {
    //     console.log('Error while posting user')
    //     console.log(error)
    //   })

    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });


  }, []); // empty list to prevent recursive loop refreshing the time

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>
        {allActivities.length > 0 &&
          <h2>
            {allActivities[0]["distance"]}
          </h2>
        }
      </header>
    </div>
  );
}

export default App;
