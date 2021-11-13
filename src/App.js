import { useState } from 'react';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Home from './components/home/home';
import Flights from './components/flights/flights';
import Checkout from './components/checkout/checkout';
import Completion from './components/completion/completion';
import SignIn from './components/signin/signin';

import useUser from './hooks/useUser.js';

function App() {
  const [user, ] = useUser();
  const [previousAppState, setPreviousAppState] = useState('home');
  const [appState, setAppState] = useState('home');

  function changeAppState(state) {
    setPreviousAppState(appState);
    setAppState(state);
  }

  if (appState === 'checkout' && !user.isConnected) {
    changeAppState('signin');
  }
  
  return (
    <>
      <Header
        isConnected={user.isConnected}
        homeState={() => changeAppState('home')}
        signInState={() => changeAppState('signin')}
        profileState={() => changeAppState('profile')}
      />
      {appState === 'home' && <Home flightsState={() => changeAppState('flights')}/>}
      {appState === 'flights' && <Flights checkoutState={() => changeAppState('checkout')}/>}
      {appState === 'checkout' && <Checkout completionState={() => changeAppState('completion')}/>}
      {appState === 'completion' && <Completion homeState={() => changeAppState('home')}/>}
      {appState === 'signin' && <SignIn previousState={() => changeAppState(previousAppState)}/>}
      <Footer />
    </>
  );
}

export default App;
