import React from 'react';
import { Link } from 'react-router-dom';

export default function Protected() {
  return (
    <div>
      <h1>You need to login to view this page</h1>
      <Link to='/login'>Login</Link>
    </div>
  )
}