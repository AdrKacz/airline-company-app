import { useState } from 'react'

import { apiendpoint } from '../constants';

// NOTE: Local Store
let user = {isConnected:false, flights: []}

function useUser(auth=false) {
  // TODO: SQL
  const [, setIsConnected] = useState(user.isConnected);
  const [, setFlights] = useState(user.flights);

  function setUserFlight(localFlight, trip='first') {
    user.flights.push({
      ...localFlight,
      trip: trip,
    });
    setFlights(user.flights);
  }

  function signOut() {
    user.isConnected = false;
    user.token = undefined;
    user.email = undefined;
    user.password = undefined;
    setIsConnected(user.isConnected);
  }

  // TODO: Hash password
  async function signIn(email, password) {
    // Ask for token
    const responseJSON = await fetch(apiendpoint + '/signin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: email,
          password: password,
      }),
    }).then(response => response.json());

    if (responseJSON && responseJSON.status === 'connected') {
      user.isConnected = true;
      user.token = responseJSON.token;
      user.email = email;
      user.password = password;
    } else {
      user.isConnected = false;
      user.token = undefined;
      user.email = undefined;
      user.password = undefined;
    }
    setIsConnected(user.isConnected);
  }

  if (auth) {
    return signIn
  } else {
    return  [user, setUserFlight, signOut]
  }
}

export default useUser;
