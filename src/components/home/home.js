import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import useSearchInfo from '../../hooks/useSearchInfo.js';
import useAirports from '../../hooks/useAirports.js';

import './home.css';

function Home({flightsState}) {
  const [searchInfo, updateAirports, updateDates, validateSearch] = useSearchInfo();
  const airports = useAirports();

  function handleDays(day, { selected }) {
    const range = DateUtils.addDayToRange(day, {from: searchInfo.fromDate, to: searchInfo.toDate});
    if (range.from && range.to && range.from.toUTCString() === range.to.toUTCString()) {
      updateDates({from: undefined, to: undefined});
    } else {
      updateDates(range);
    }
  }

  function handleAirports({from, to}) {
    updateAirports({from, to});
  }

  function handleSubmit(e) {
    e.preventDefault();
    validateSearch();
    flightsState();
  }

  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const { from, to } = {from: searchInfo.fromDate, to: searchInfo.toDate};
  const modifiers = { start: from, end: to };

  const airportOptions = (key) => (airports.map((airport, i) => (
    <option key={`${key}.${i}`} value={airport.id}>{airport.name}</option>
  )));

  return (
    <main className='flex-shrink-0'>
      <div className='container'>
        <h1 className='mt-5'>Not So Green</h1>
        <p className='lead'>Book your flight and discover new worlds.</p>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-3'>
            <select
              value={searchInfo.fromAirport}
              onChange={({target}) => handleAirports({from: target.value, to: searchInfo.toAirport})}
              className='form-select'
              id='floatingSelect'
            >
              <option>...</option>
              {airportOptions('from')}
            </select>
            <label htmlFor="floatingSelect">From</label>
          </div>
          <div className='form-floating mb-3'>
            <select
              value={searchInfo.toAirport}
              onChange={({target}) => handleAirports({from: searchInfo.fromAirport, to: target.value})}
              className='form-select'
              id='floatingSelect'
            >
              <option>...</option>
              {airportOptions('to')}
            </select>
            <label htmlFor="floatingSelect">To</label>
          </div>
          <div className='mb-3'>
            <DayPicker
              className='Selectable'
              numberOfMonths={2}
              onDayClick={handleDays}
              modifiers={modifiers}
              selectedDays={[from, { from, to }]}
            />
          </div>
          {searchInfo.fromAirport && searchInfo.toAirport && from &&
          <div className='card mb-3'>
            <div className='card-header'>
              Ready to set the earth on fire?
            </div>
            <div className='card-body'>
              <h5 className='card-title'>{searchInfo.fromAirport} - {searchInfo.toAirport}</h5>
              <p className='lead'>From</p>
              <p>{from.toLocaleDateString(undefined, options)}</p>
              {to && (<>
                <p className='lead'>To</p>
                <p>{to.toLocaleDateString(undefined, options)}</p>
              </>)}
              <button className="btn btn-primary" type="submit">Confirm</button>
            </div>
          </div>
          }
        </form>
      </div>
    </main>
  )
}

export default Home;
