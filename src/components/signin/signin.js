import { useState } from 'react';

import useUser from '../../hooks/useUser.js';

import airTransport from '../../assets/air-transport.png';

import './signin.css'

function SignIn({previousState}) {
  const signIn = useUser(true)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleChangeEmail({target}) {
    setEmail(target.value);
  }

  function handleChangePassword({target}) {
    setPassword(target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    signIn(email, password);
    previousState();
  }

  return (
    <main className="form-signin text-center">
      <form onSubmit={handleSubmit}>
        <img className="mb-4" src={airTransport} alt="" width="72" height="72"/>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input onChange={handleChangeEmail} type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input onChange={handleChangePassword} type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>
  );
}

export default SignIn;
