import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import './App.css';

import { IUser } from '../../src/models/user'

const App: React.FC = () => {
  const [ user, setUser ] = useState<IUser>({} as IUser)
  const [ token, setToken] = useState<string>('')
  const [ errorMessage, setErrorMessage ] = useState<string>('')
  
  //setting user to null
  function checkForLocalToken() {
    var token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      localStorage.removeItem('mernToken');
      setToken('')
      setUser({} as IUser)
    } else {
      axios.post('/auth/me/from/token', {token})
        .then(res => {
          if (res.data.type === 'error') {
            localStorage.removeItem('mernToken');
            setToken('');
            setUser({} as IUser);
            setErrorMessage(res.data.message)
          } else {
            localStorage.setItem('mernToke', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
          }
        })
    }
  }

  function logout(): void {
    localStorage.removeItem('mernToken');
    setToken('');
    setUser({} as IUser)
  }

  useEffect(() => {
    checkForLocalToken()
  }, [])

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
      <>
        <p>Please sign up or log in</p>
        <Login /><br />
        <Signup />
      </>
    )
  }

  return (
    <>
      {contents}
    </>
  );
}

export default App;
