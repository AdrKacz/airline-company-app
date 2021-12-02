import { useState, useEffect } from 'react';

import { apiendpoint } from '../constants';

let globalAirports = {};

const url = () => (
  `${apiendpoint}/airports`
);

const fetchAPI = async() => {
  const response = await fetch(url());
  return await response.json();
};

function useAirports() {
  const [airports, setAirports] = useState(globalAirports);

  // API Request
  useEffect(() => {
    let isMounted = true;
    fetchAPI().then(response => {
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }
      const data = {}
      response.forEach(airport => {
        data[airport.id] = {
          id: airport.id,
          name: airport.name,
          code: airport.code,
        }
      });
      setAirports(data);
      globalAirports = data;
    }).catch(err => {
      console.error(err);
    });

    return () => {
      isMounted = false;
    };

  }, []);

  return airports;
}

export default useAirports;
