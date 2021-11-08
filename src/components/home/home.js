import { useState } from 'react';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import './home.css';

function Home({checkoutState}) {
  const [selectedRangeDays, setSelectedRangeDays] = useState({from: undefined, to: undefined});

  function handleClick(e) {
    e.preventDefault();
    checkoutState();
  }

  function handleDayClick(day, { selected }) {
    const range = DateUtils.addDayToRange(day, selectedRangeDays)
    setSelectedRangeDays(range)
  }


  const { from, to } = selectedRangeDays;
  const modifiers = { start: from, end: to };
  return (
    <main className='flex-shrink-0'>
      <div className='container'>
        <h1 className="mt-5">Not So Green</h1>
        <p className="lead">Book your flight and discover new worlds.</p>
        <button onClick={handleClick} className="w-100 btn btn-lg btn-primary" type="submit">Checkout</button>
        <DayPicker
          className='Selectable'
          numberOfMonths={2}
          onDayClick={handleDayClick}
          modifiers={modifiers}
          selectedDays={[from, { from, to }]}
        />
      </div>
    </main>
  )
}

export default Home;
