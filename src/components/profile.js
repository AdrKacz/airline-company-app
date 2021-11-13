import useUser from '../../hooks/useUser.js';

function Profile() {
  const [user, ] = useUser();

  return (
    <div className='container pb-5'>
      <main>
        <div className='py-5 text-center'>
          <img className='d-block mx-auto mb-4' src={airTransport} alt='' width='72' height='72'/>
          <h2>Your profile</h2>
          <p className='lead'>Just think about yourself.</p>
        </div>
      </main>
    </div>
  )
}

export default Flights;
