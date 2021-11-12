import { useState } from 'react';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import './home.css';

function Home({flightsState}) {
  const [selectedAirports, setSelectedAirports] = useState({from: undefined, to: undefined});
  const [selectedRangeDays, setSelectedRangeDays] = useState({from: undefined, to: undefined});

  function handleDays(day, { selected }) {
    const range = DateUtils.addDayToRange(day, selectedRangeDays);
    if (range.from && range.to && range.from.toUTCString() === range.to.toUTCString()) {
      setSelectedRangeDays({from: undefined, to: undefined});
    } else {
      setSelectedRangeDays(range);
    }
  }

  function handleAirports({from, to}) {
    setSelectedAirports({from, to})
  }

  function handleSubmit(e) {
    e.preventDefault();
    flightsState();
  }

  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
  const { from, to } = selectedRangeDays;
  const modifiers = { start: from, end: to };
  return (
    <main className='flex-shrink-0'>
      <div className='container'>
        <h1 className='mt-5'>Not So Green</h1>
        <p className='lead'>Book your flight and discover new worlds.</p>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-3'>
            <select
              value={selectedAirports.from}
              onChange={({target}) => handleAirports({from: target.value, to: selectedAirports.to})}
              className='form-select'
              id='floatingSelect'
            >
              <option>...</option>
              <option value='CDG'>Charles de Gaulle</option>
              <option value='MRS'>Marseille</option>
            </select>
            <label htmlFor="floatingSelect">From</label>
          </div>
          <div className='form-floating mb-3'>
            <select
              value={selectedAirports.to}
              onChange={({target}) => handleAirports({from: selectedAirports.from, to: target.value})}
              className='form-select'
              id='floatingSelect'
            >
              <option>...</option>
              <option value='CDG'>Charles de Gaulle</option>
              <option value='MRS'>Marseille</option>
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
          {selectedAirports.from && selectedAirports.to && from &&
          <div className='card mb-3'>
            <div className='card-header'>
              Ready to set the earth on fire?
            </div>
            <div className='card-body'>
              <h5 className='card-title'>{selectedAirports.from} - {selectedAirports.to}</h5>
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
