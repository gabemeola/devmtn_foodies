import React, { Component } from 'react';
import Protected from './Protected';
import Foodies from './Foodies';
import axios from 'axios';


export default class Profile extends Component {
  constructor() {
    super();

    this.state = {
      name: null,
      email: null,
      isLoggedIn: null,
    }
  }
  componentDidMount() {
    axios.get('/me')
      .then((response) => {
        const { name, email } = response.data;

        this.setState({
          name,
          email,
          isLoggedIn: true,
        })
      })
      .catch((err) => {
        console.log('not logged in');
        this.setState({
          isLoggedIn: false,
        })
      })
  }
  render() {
    if (this.state.isLoggedIn === null) return null;

    return this.state.isLoggedIn === true
      ? (
        <div>
          <h1>Welcome back {this.state.name}</h1>
          <h2>Your email is {this.state.email}</h2>
          <hr />
          <Foodies />
        </div>
      )
      : <Protected />
  }
}