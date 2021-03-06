import { useState } from 'react';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Home from './components/home/home';
import Flights from './components/flights/flights';
import Checkout from './components/checkout/checkout';
import Completion from './components/completion/completion';
import SignIn from './components/signin/signin';
import Profile from './components/profile/profile';
import Admin from './components/admin/admin';

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

  if (appState === 'admin' && !user.isAdmin) {
    setAppState('home'); // without redirect
  }
  
  return (
    <>
      <Header
        isConnected={user.isConnected}
        isAdmin={user.isAdmin}
        homeState={() => changeAppState('home')}
        signInState={() => changeAppState('signin')}
        profileState={() => changeAppState('profile')}
        adminState={() => changeAppState('admin')}
      />
      {appState === 'home' && <Home flightsState={() => changeAppState('flights')}/>}
      {appState === 'flights' && <Flights checkoutState={() => changeAppState('checkout')}/>}
      {appState === 'checkout' && <Checkout completionState={() => changeAppState('completion')}/>}
      {appState === 'completion' && <Completion homeState={() => changeAppState('home')}/>}
      {appState === 'signin' && <SignIn previousState={() => changeAppState(previousAppState)}/>}
      {appState === 'profile' && <Profile previousState={() => changeAppState(previousAppState)} checkoutState={() => changeAppState('checkout')}/>}
      {appState === 'admin' && <Admin/>}
      <Footer />
    </>
  );
}

export default App;
