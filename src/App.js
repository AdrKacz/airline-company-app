import { useState } from 'react';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Home from './components/home/home';
import Flights from './components/flights/flights';
import Checkout from './components/checkout/checkout';
import Completion from './components/completion/completion';
import SignIn from './components/signin/signin';

function App() {
  const [appState, setAppState] = useState('home')

  return (
    <>
      <Header
        homeState={() => setAppState('home')}
        signInState={() => setAppState('signin')}
      />
      {appState === 'home' && <Home flightsState={() => setAppState('flights')}/>}
      {appState === 'flights' && <Flights checkoutState={() => setAppState('checkout')}/>}
      {appState === 'checkout' && <Checkout completionState={() => setAppState('completion')}/>}
      {appState === 'completion' && <Completion homeState={() => setAppState('home')}/>}
      {appState === 'signin' && <SignIn />}
      <Footer />
    </>
  );
}

export default App;
