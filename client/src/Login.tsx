import React, { useState } from 'react';
import { ISetTokens } from './react-app-env';
import axios from 'axios';

const Login: React.FC<ISetTokens> = ({setToken, history}) => {
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    console.log('submitting the log in...')
    e.preventDefault()
    axios.post('/auth/login', {
      email: email,
      password: password
    }).then(res => {
      if (res.data.type === 'error') {
        console.log('nope!')
        setEmail('');
        setPassword('');
        setMessage(res.data.message);
        console.log(message)
      } else {
        console.log('i found this')
        localStorage.setItem('mernToken', res.data.token);
        setMessage('')
        setToken(res.data.token);
      }
    }).catch(err => {
      setMessage('Maximum login attempts exceeded. Please try again later')
    }).finally(() => {
      history.push('/library')
    })
  }

  return(
    <div className="Login">
    <h3>Log into your account:</h3>
    <form onSubmit={handleSubmit}>
      <input type="email"
        name="email"
        placeholder="Enter your email..."
        onChange={handleEmailChange}
        value={email} /><br />
      <input type="password"
        name="password"
        placeholder="Enter your password..."
        onChange={handlePasswordChange}
        value={password} /><br />
      <input type="submit" value="Log In!" />
    </form>
  </div>
  )
}


export default Login;