function Header({homeState, signInState}) {
  function handleClickHome(e) {
    e.preventDefault();
    homeState();
  }

  function handleClickSignIn(e) {
    e.preventDefault();
    signInState();
  }

  return (
    <header>
      <nav className='py-2 bg-light border-bottom'>
        <div className='container d-flex flex-wrap'>
          <ul className='nav me-auto'>
            <li className='nav-item'>
              <button type='button' onClick={handleClickHome} className='btn nav-link link-dark px-2'>Home</button>
            </li>
            <li className='nav-item'>
              <button type='button' onClick={handleClickSignIn} className='btn nav-link link-dark px-2'>Sign in</button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header;
