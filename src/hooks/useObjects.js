import { useState, useEffect } from 'react';

const url = (object) => (
  `http://127.0.0.1:8080/${object}`
);

const fetchAPI = async(object) => {
  const response = await fetch(url(object));
  return await response.json();
};

const allowedName = [
    'airports',
    'employees',
    'connections',
    'airplanes',
    'flights',
    'pilots',
    'crew-members',
    'departures',
    'consumers'
]

let lastMountedNames = [];

function useObjects(names) {
    const [objects, setObjects] = useState({});

    lastMountedNames = [];
    names.forEach(name => {
        if (allowedName.includes(name)) {
            lastMountedNames.push(name);
        };
    });
  
    // API Request
    useEffect(() => {
      let isMounted = true;
      const keys = lastMountedNames;
      Promise.all(keys.map((key, ) => (
        fetchAPI(key)
      ))).then(responses => {
          // Avoid updating state if the component unmounted before the fetch completes
        if (!isMounted) {
            return;
        }

        const localObjects = {}
        responses.forEach((response, index) => {
            localObjects[keys[index]] = response
        });
        setObjects(localObjects);
      }).catch(err => {
        console.error(err);
      });
  
      return () => {
        isMounted = false;
      };
  
    }, []);
  
    return objects;
  }
  
  export default useObjects;