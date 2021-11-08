import { useState } from 'react';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Home from './components/home/home';
import Checkout from './components/checkout/checkout';
import SignIn from './components/signin/signin';

function App() {
  const [appState, setAppState] = useState('home')

  return (
    <>
      <Header
        homeState={() => setAppState('home')}
        signInState={() => setAppState('signin')}
      />
      {appState === 'home' && <Home checkoutState={() => setAppState('checkout')}/>}
      {appState === 'signin' && <SignIn />}
      {appState === 'checkout' && <Checkout />}
      <Footer />
    </>
  );
}

export default App;
