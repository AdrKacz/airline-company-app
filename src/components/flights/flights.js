import useFlights from '../../hooks/useFlights.js';
import useUser from '../../hooks/useUser.js';

function Flights({checkoutState}) {
  const flights = useFlights();
  const [, setFlight] = useUser();

  function handleClickFlight(value) {
      setFlight(flights[value].first);
      checkoutState();
  }

  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};

  return (
    <main className='flex-shrink-0'>
      <div className='container'>
        <div className='mt-5'>
          {flights.map(({first}, i) => (
            <div key={i} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{`$${first.price}`}</h5>
                <p className='card-text lead'>Departure</p>
                <p className='card-text'>{first.departure.toLocaleDateString(undefined, options)}</p>
                <p className='card-text lead'>Arrival</p>
                <p className='card-text'>{first.arrival.toLocaleDateString(undefined, options)}</p>
                <button onClick={() => handleClickFlight(i)} className="btn btn-primary">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Flights;
