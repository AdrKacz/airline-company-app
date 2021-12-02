import useFlights from '../../hooks/useFlights.js';
import useUser from '../../hooks/useUser.js';
import useAirports from '../../hooks/useAirports';

function Flights({checkoutState}) {
  const airports = useAirports();
  const [flights, details, setLookFirst] = useFlights();
  const [, setFlight, ] = useUser();

  function handleClickFlight(value) {
      setFlight(flights[value]);
      if (details.isFirst) {
        setLookFirst(false)
      } else {
        checkoutState();
      }
      
  }
  
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};

  return (
    <main className='flex-shrink-0'>
      <div className='container'>
      <h2 className='my-3'>{airports[details.fromAirport].name} - {airports[details.toAirport].name}</h2>
        <div>
          {Object.values(flights).map((flight, i) => (
            <div key={i} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{`$${flight.price}`}</h5>
                <p className='card-text lead'>Departure</p>
                <p className='card-text'>{flight.departure.toLocaleDateString(undefined, options)}</p>
                <p className='card-text lead'>Arrival</p>
                <p className='card-text'>{flight.arrival.toLocaleDateString(undefined, options)}</p>
                <button onClick={() => handleClickFlight(flight.id)} className="btn btn-primary">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Flights;
