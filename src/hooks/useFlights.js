import { useState, useEffect } from 'react';

import { apiendpoint } from '../constants';

import useSearchInfo from './useSearchInfo.js';

const url = (fromAirport, toAirport, date) => (
  `${apiendpoint}/flights/airports/${fromAirport}-${toAirport}/date/${date.valueOf()}`
);

const fetchAPI = async(fromAirport, toAirport, date) => {
  const response = await fetch(url(fromAirport, toAirport, date));
  return await response.json();
};

function useFlights() {
  const [lookFirst, setLookFirst] = useState(true);
  const [flights, setFlights] = useState([]);
  const [searchInfo, ] = useSearchInfo();

  // Set looking flight
  let fromAirport, toAirport, date;
  if (lookFirst) {
    [fromAirport, toAirport, date] = [searchInfo.fromAirport, searchInfo.toAirport, searchInfo.fromDate];
  } else {
    [fromAirport, toAirport, date] = [searchInfo.toAirport, searchInfo.fromAirport, searchInfo.toDate];
  }
  function loadFlights() {
    // Fetch API
    let isMounted = true;
    fetchAPI(fromAirport, toAirport, date).then(responseJSON => {
      if (!isMounted) {
        return;
      }
      const data = {}
      responseJSON.forEach(flight => {
        data[flight.id] = {
          id: flight.id,
          from: flight.from,
          to: flight.to,
          departure: new Date(flight.departure),
          arrival: new Date(flight.arrival),
          price: flight.price,
        };
      });
      setFlights(data);
    });

    return () => {
      isMounted = false;
    }; 
  }

  // API Request
  useEffect(loadFlights, [lookFirst, fromAirport, toAirport, date]);

  return [flights, {
    isFirst: lookFirst,
    fromAirport: fromAirport,
    toAirport: toAirport,
    date: date,
  }, setLookFirst];
}

export default useFlights;
