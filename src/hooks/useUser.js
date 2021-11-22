import { useState } from 'react'

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

  function signIn(email, password) {
    setIsConnected(true);
    user.isConnected = true;
    user.email = email;
    user.password = password;
  }

  if (auth) {
    return signIn
  } else {
    return  [user, setUserFlight]
  }
}

export default useUser;
