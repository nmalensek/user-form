import React from 'react';
import './App.css';
import axios from 'axios';
import SearchResult from './SearchResult.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
  }
  
  componentDidMount() {
    this.getAllUsers();
    console.log(this.state.users);
  }

  getAllUsers() {
    axios.get('/users').then((res) => {
      console.log(res)
      // this.setState({
      // users: res.data
    // });
  })
  }

  handleInputChange() {

  }

  handleNewUserSubmit() {

  }

  handleUserDelete() {

  }

  handleUserChange() {

  }

  render() {
    const searchResults = this.state.users.map((user, ind, arr) => {
      return (
      <SearchResult 
        key = {ind}
        firstName = {user.firstName}
        lastName = {user.lastName}
        email = {user.email}
        org = {user.organization}
        deleteFunc = {this.handleUserDelete}
        editFunc = {this.handleUserChange}
      />
      )
    })

    return (
      <div className="App">
        <div>
          <h1>
            User Management
          </h1>
        </div>
        <div className="newUser">
          <label>
            First Name:
            <input id="firstNameInput" type="text" onChange={this.handleInputChange}>
            </input>
          </label>
          
          <label>
            Last Name:
            <input id="lastNameInput" type="text" onChange={this.handleInputChange}>
            </input>
          </label>
          
          <label>
            Email:
            <input id="emailInput" type="email" onChange={this.handleInputChange}>
            </input>
          </label>
          
          <label>
            Organization:
            <input id="orgInput" type="text" onChange={this.handleInputChange}>
            </input>
          </label>
        </div>
        <div>
          {searchResults}
        </div>
        <div>{this.state.users}</div>
      </div>
    );
  }
}

export default App;
