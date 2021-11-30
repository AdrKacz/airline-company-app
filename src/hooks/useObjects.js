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

    function loadData() {
      console.log('RELOAD')
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
            const localResponse = response.map((item) => {
              const localItem = {};
              Object.entries(item).forEach(([key, value]) => {
                localItem[key.replace(/_/g, '-')] = value
              });
              return localItem;
            })
            localObjects[keys[index]] = localResponse;
        });
        setObjects(localObjects);
      }).catch(err => {
        console.error(err);
      });
  
      return () => {
        isMounted = false;
      };
    }
  
    // API Request
    useEffect(loadData, []);
  
    return [objects, loadData];
  }
  
  export default useObjects;