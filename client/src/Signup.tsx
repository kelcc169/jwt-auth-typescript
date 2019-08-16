import React, { useState } from 'react';
import { ISetTokens } from './App';
import axios from 'axios';

const Signup: React.FC<ISetTokens> = ({setToken}) => {
  const [ name, setName ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    console.log('submitting...')
    e.preventDefault()
    axios.post('/auth/signup', {
      name: name,
      email: email,
      password: password
    }).then(res => {
      if (res.data.type === 'error') {
        console.log('nope!')
        setName('');
        setEmail('');
        setPassword('');
        setMessage(res.data.message);
        console.log(message)
      } else {
        console.log('i maked this')
        localStorage.setItem('mernToken', res.data.token);
        setMessage('')
        setToken(res.data.token);
      }
    }).catch(err => {
      setMessage('Maximum accounts exceeded. Please try again later')
    })
  }

  return(
    <div className="Signup">
      <h3>Create a new account:</h3>
      <form onSubmit={handleSubmit}>
        <input type="text"
          name="name"
          placeholder="Enter your name..."
          onChange={handleNameChange}
          value={name} /><br />
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
        <input type="submit" value="Sign Up!" />
      </form>
    </div>
  )
}

export default Signup;