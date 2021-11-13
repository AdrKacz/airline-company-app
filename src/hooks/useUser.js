import { useState } from 'react'

// NOTE: Local Store
let user = {isConnected:false}

function useUser(auth=false) {
  // TODO: SQL
  const [, setIsConnected] = useState(user.isConnected);
  const [, setFlight] = useState(user.flight);

  function setUserFlight(localFlight) {
    setFlight(localFlight);
    user.flight = localFlight;
  }

  function signIn(email, password) {
    console.log('SignIn', email, password)
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
