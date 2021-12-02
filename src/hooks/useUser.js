import { useState } from 'react'

import { apiendpoint } from '../constants';

// NOTE: Local Store
let user = {isConnected:false, flights: {}}

function useUser(auth=false) {
  // TODO: SQL
  const [, setIsConnected] = useState(user.isConnected);
  const [, setFlights] = useState(user.flights);
  const [flag, setFlag] = useState(false); // to trigger the re-render pipeline

  function setUserFlight(localFlight) {
    user.flights[localFlight.id] = localFlight;
    setFlights(user.flights);
    setFlag(!flag);
  }

  function removeUserFlight(flightId) {
    delete user.flights[flightId];
    setFlights(user.flights);
    setFlag(!flag);
  }

  function signOut() {
    user.isConnected = false;
    user.token = undefined;
    user.isAdmin = undefined;
    user.email = undefined;
    user.password = undefined;
    setIsConnected(user.isConnected);
    setFlag(!flag);
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
      user.isAdmin = responseJSON.isAdmin;
      user.email = email;
      user.password = password;
      setIsConnected(user.isConnected);
    } else {
      signOut()
    }
  }

  if (auth) {
    return signIn
  } else {
    return  [user, setUserFlight, signOut, removeUserFlight, flag]
  }
}

export default useUser;
