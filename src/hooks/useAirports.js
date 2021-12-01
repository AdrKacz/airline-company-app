import { useState, useEffect } from 'react';

import { apiendpoint } from '../constants';

const url = () => (
  `${apiendpoint}/airports`
);

const fetchAPI = async() => {
  const response = await fetch(url());
  return await response.json();
};

function useAirports() {
  const [airports, setAirports] = useState([]);

  // API Request
  useEffect(() => {
    let isMounted = true;
    fetchAPI().then(response => {
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      const data = response.map(airport => ({
        name: airport.name,
        code: airport.code,
      }));
      setAirports(data);
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
