import airTransport from '../../assets/air-transport.png';

import useUser from '../../hooks/useUser';

function Profile({previousState, checkoutState}) {
  const [user, , signOut, removeFlight] = useUser();

  function handleSignOutClick() {
    signOut();
    previousState();
  }

  function handleCloseClick(flightId) {
    removeFlight(flightId);
  }

  function handleCheckout() {
    checkoutState();
  }

  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};
  return (
    <div className='container pb-5'>
      <main>
        <div className='py-5 text-center'>
          <img className='d-block mx-auto mb-4' src={airTransport} alt='' width='72' height='72'/>
          <h2>Your profile</h2>
          <p className='lead'>Just think about yourself.</p>
          <button onClick={handleSignOutClick} className='btn btn-primary'>Sign out</button>
        </div>
        <div className='list-group mb-5'>
          {Object.values(user.flights).map((flight, i) => (
            <div key={i} className='list-group-item list-group-item-action'>
              <div className='d-flex w-100 justify-content-between'>
                <h5 className='mb-1'>{flight.from} - {flight.to}</h5>
                <button onClick={() => handleCloseClick(flight.id)} type='button' className='btn-close' aria-label='Close'></button>
              </div>
              <p className='mb-1'>{flight.departure.toLocaleDateString(undefined, options)} - {flight.arrival.toLocaleDateString(undefined, options)}</p>
              <small>${flight.price}</small>
            </div>
          ))}
        </div>
        {Object.values(user.flights).length > 0 &&
        <div className='d-grid'>
          <button onClick={handleCheckout} className='btn btn-outline-primary' type='submit'>Checkout</button>
        </div> 
        }
      </main>
    </div>
  )
}

export default Profile;
