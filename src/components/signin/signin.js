import airTransport from '../../assets/air-transport.png';

import './signin.css'

function SignIn() {
  return (
    <main className="form-signin text-center">
      <form>
        <img className="mb-4" src={airTransport} alt="" width="72" height="72"/>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me"/> Remember me
          </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>
  );
}

export default SignIn;
