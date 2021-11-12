import useSearchInfo from './useSearchInfo.js';

function useFlights() {
  // TODO: SQL
  
  const [searchInfo, ] = useSearchInfo();

  // TODO: Get Flights
  function createFlight({from, to, departure}) {
    const arrival = new Date(departure);
    arrival.setMinutes(arrival.getMinutes() + Math.random() * 1440);
    return {
      from: searchInfo.fromAirport,
      to: searchInfo.toAirport,
      departure: departure,
      arrival: arrival,
      price: 150 + Math.floor(Math.random() * 100)
    }
  }

  const flights = (() => {
    const flights = [];
    for (let i = 0; i < 10; i++) {
      if (searchInfo.toDate) {
        flights.push({
          first: createFlight({from: searchInfo.fromAirport, to: searchInfo.toAirport, departure: searchInfo.fromDate}),
          second: createFlight({from: searchInfo.fromAirport, to: searchInfo.toAirport, departure: searchInfo.toDate}),
        });
      } else {
        flights.push({
          first: createFlight({from: searchInfo.fromAirport, to: searchInfo.toAirport, departure: searchInfo.fromDate}),
        });
      }
    }
    return flights
  })();

  return flights
}

export default useFlights;
