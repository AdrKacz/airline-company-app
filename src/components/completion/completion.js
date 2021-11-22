function Completion({homeState}) {

  function handleClick(e) {
      e.preventDefault();
      homeState();
  }

  return (
    <div className="text-center cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <div className='mb-auto'></div>
      <main className="px-3">
        <h1>Well done.</h1>
        <p className="lead">To balance the carbon footprint of your flight, you must stop eating for 153 days.</p>
        <button onClick={handleClick} className="btn btn-primary">Return to home</button>
      </main>
      <div className='mt-auto'></div>
    </div>
  )
}

export default Completion;
