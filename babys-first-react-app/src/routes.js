import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';


export default function Routes() {
  return (
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
    </div>
  )
}