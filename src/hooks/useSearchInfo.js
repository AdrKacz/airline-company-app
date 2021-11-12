import { useState } from 'react';

// NOTE: Local Store
let searchInfo = {
  fromAirport: undefined,
  toAirport: undefined,
  fromDate: undefined,
  toDate: undefined,
}

function useSearchInfo() {
  const [fromAirport, setFromAirport] = useState(searchInfo.fromAirport);
  const [toAirport, setToAirport] = useState(searchInfo.toAirport);

  const [fromDate, setFromDate] = useState(searchInfo.fromDate);
  const [toDate, setToDate] = useState(searchInfo.toDate);

  function updateAirports({from, to}) {
    if (from !== fromAirport) {
      setFromAirport(from);
    }
    if (to !== toAirport) {
      setToAirport(to);
    }
  }

  function updateDates({from, to}) {
    if (from !== fromDate) {
      setFromDate(from);
    }
    if (to !== toDate) {
      setToDate(to);
    }
  }

  function validateSearch() {
    searchInfo = {
      fromAirport: fromAirport,
      toAirport: toAirport,
      fromDate: fromDate,
      toDate: toDate,
    }
  }

  return [{
    fromAirport: fromAirport,
    toAirport: toAirport,
    fromDate: fromDate,
    toDate: toDate,
  }, updateAirports, updateDates, validateSearch];
}

export default useSearchInfo;
