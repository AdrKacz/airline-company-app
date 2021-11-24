import { useState, useEffect } from 'react';

import useSearchInfo from './useSearchInfo.js';

const url = (fromAirport, toAirport, date) => (
  `http://127.0.0.1:8080/flights/airports/${fromAirport}-${toAirport}/date/${date.valueOf()}`
);

const fetchAPI = async(fromAirport, toAirport, date) => {
  const response = await fetch(url(fromAirport, toAirport, date));
  return await response.json();
};

function useFlights() {
  const [flights, setFlights] = useState([]);
  const [searchInfo, ] = useSearchInfo();

  // API Request
  useEffect(() => {
    let isMounted = true;
    fetchAPI(searchInfo.fromAirport, searchInfo.toAirport, searchInfo.fromDate).then(response => {
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      const data = response.map(flight => ({
          first: {
            from: flight.from,
            to: flight.to,
            departure: new Date(flight.departure),
            arrival: new Date(flight.arrival),
            price: flight.price,
          },
      }));
      setFlights(data);
    }).catch(err => {
      console.error(err);
    });

    return () => {
      isMounted = false;
    };

  }, [searchInfo.fromAirport, searchInfo.toAirport, searchInfo.fromDate]);

  return flights;
}

export default useFlights;
