import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const data = {
      "name": "Rory Sproule",
      "type": "Admin",
      "age": 22,
    }

    let activities_url = `https://www.strava.com/api/v3/athlete/activities?access_token=4d65c4753c4244808f1d334f969c38f483c0eb77&per_page=50`
    axios.get(activities_url, data, {})
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log('Error while posting user')
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


    // axios.get(`/users`, data, {})
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log('Error while posting user')
    //     console.log(error)
    //   })
    // axios.get(`/time`, {})
    //       .then((response) => {
    //         const status = response.data
    //         console.log(status)

    //       })
    //       .catch((error) => {
    //         console.log('Error while polling for job status')
    //         console.log(error)
    //       })
    // fetch('/time').then(res => res.json()).then(data => {
    //   setCurrentTime(data.time);
    // });


  }, []); // empty list to prevent recursive loop refreshing the time

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>
    </div>
  );
}

export default App;
