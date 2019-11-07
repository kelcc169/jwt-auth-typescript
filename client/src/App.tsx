import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import './App.css';

import { IUser } from './react-app-env';

const App: React.FC = () => {
  const [ user, setUser ] = useState<IUser>({} as IUser)
  const [ token, setToken] = useState<string>('')
  const [ errorMessage, setErrorMessage ] = useState<string>('')

  // log out of program
  function logout(): void {
    localStorage.removeItem('mernToken');
    setToken('');
    setUser({} as IUser);
  }

  // check for local token when loading OR when token changes.
  useEffect(() => {
    var token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      localStorage.removeItem('mernToken');
      setToken('');
      setUser({} as IUser);
    } else {
      axios.post('/auth/me/from/token', {token})
        .then(res => {
          if (res.data.type === 'error') {
            localStorage.removeItem('mernToken');
            setToken('');
            setUser({} as IUser);
            setErrorMessage(res.data.message);
            console.log(errorMessage)
          } else {
            localStorage.setItem('mernToken', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
          }
        })
    }
  }, [token, errorMessage])

  var contents;
  if (Object.keys(user).length > 0) {
    contents = (
      <>
        <p>Hello, {user.name}</p>
        <p onClick={logout}>Log Out!</p>
      </>
    )
  } else {
    contents = (
      <Router>
        <p>Please Log In or Sign Up</p>
        <Route path='/login' render={(props) => <Login setToken={setToken} {...props} /> } />
        <Route path='/signup' render={(props) => <Signup setToken={setToken} {...props} /> } />        
      </Router>
    )
  }

  return (
    <>
      {contents}
    </>
  );
}

export default App;
