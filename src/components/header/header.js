function Header({isConnected, homeState, signInState, profileState}) {
  function handleClickHome(e) {
    e.preventDefault();
    homeState();
  }

  function handleClickSignIn(e) {
    e.preventDefault();
    signInState();
  }

  function handleClickProfile(e) {
    e.preventDefault();
    profileState();
  }

  return (
    <header>
      <nav className='py-2 bg-light border-bottom'>
        <div className='container d-flex flex-wrap'>
          <ul className='nav me-auto'>
            <li className='nav-item'>
              <button type='button' onClick={handleClickHome} className='btn nav-link link-dark px-2'>Home</button>
            </li>
            {isConnected &&
              <li className='nav-item'>
                <button type='button' onClick={handleClickProfile} className='btn nav-link link-dark px-2'>Profile</button>
              </li>
            }
            {!isConnected &&
              <li className='nav-item'>
                <button type='button' onClick={handleClickSignIn} className='btn nav-link link-dark px-2'>Sign in</button>
              </li>
            }
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header;
