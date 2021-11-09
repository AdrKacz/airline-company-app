function Flights({checkoutState}) {

  function handleClick(value) {
      console.log(value);
      checkoutState();
  }

  return (
    <main className='flex-shrink-0'>
      <div className='container'>
        <div className='list-group mt-5'>
          <button onClick={() => handleClick(1)} type="button" class='list-group-item list-group-item-action'>Flight 1</button>
          <button onClick={() => handleClick(2)} type="button" class='list-group-item list-group-item-action'>Flight 2</button>
        </div>
      </div>
    </main>
  )
}

export default Flights;
