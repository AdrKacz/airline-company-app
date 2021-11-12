import { useState } from 'react'

// NOTE: Local Store
let user = {}

function useUser() {
  // TODO: SQL
  const [flight, setFlight] = useState(user.flight);

  function setUserFlight(localFlight) {
    setFlight(localFlight);
    user.flight = localFlight;
  }

  return [{
    flight: flight
  }, setUserFlight];
}

export default useUser;
