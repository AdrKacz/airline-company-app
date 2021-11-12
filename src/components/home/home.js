import { useState } from 'react';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import './home.css';

function Home({flightsState}) {
  const [selectedRangeDays, setSelectedRangeDays] = useState({from: undefined, to: undefined});

  function handleDayClick(day, { selected }) {
    const range = DateUtils.addDayToRange(day, selectedRangeDays);
    setSelectedRangeDays(range);
  }

  function handleConfirmClick(e) {
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
        <form>
          <div className='form-floating mb-3'>
            <select className='form-select' id='floatingSelect'>
              <option selected value='CDG'>Charles de Gaulle</option>
              <option value='MRS'>Marseille</option>
            </select>
            <label htmlFor="floatingSelect">From</label>
          </div>
          <div className='form-floating mb-3'>
            <select className='form-select' id='floatingSelect'>
              <option selected value='CDG'>Charles de Gaulle</option>
              <option value='MRS'>Marseille</option>
            </select>
            <label htmlFor="floatingSelect">To</label>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <DayPicker
                className='Selectable'
                numberOfMonths={2}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                selectedDays={[from, { from, to }]}
              />
            </div>
            {from &&
            <div className='col'>
              <div className='card'>
                <div className='card-header'>
                  Ready to set the earth on fire?
                </div>
                <div className='card-body'>
                  <h5 className='card-title'>Marseille - Charles de Gaulle</h5>
                  <button onClick={handleConfirmClick} class="btn btn-primary mb-5" type="submit">Confirm</button>
                </div>
              </div>
            </div>
            }
          </div>
        </form>
      </div>
    </main>
  )
}

export default Home;
