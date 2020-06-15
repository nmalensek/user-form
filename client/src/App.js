import React from 'react';
import './App.css';
import axios from 'axios';
import SearchResult from './SearchResult.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      firstNameInput: '',
      lastNameInput: '',
      emailInput: '',
      organizationInput: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers() {
    axios.get('/users').then(res => {
      this.setState({
        users: res.data
      });
    });
  }

  handleInputChange(e) {
    
  }

  handleNewUserSubmit(e) {
    axios.post('/users', {

    });
  }

  handleUserDelete(id, e) {
    axios.delete('/users/' + id).then(
      //display success message.
    );
  }

  handleUserChange(id, e) {

  }

  render() {
    const searchResults = this.state.users.map((user, ind) => {
      return (
        <SearchResult
          key={ind}
          id={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          org={user.organization}
          deleteFunc={this.handleUserDelete}
          editFunc={this.handleUserChange}
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
            <input id="firstNameInput" type="text" value={this.state.firstNameInput} onChange={this.handleInputChange}>
            </input>
          </label>

          <label>
            Last Name:
            <input id="lastNameInput" type="text" value={this.state.lastNameInput} onChange={this.handleInputChange}>
            </input>
          </label>

          <label>
            Email:
            <input id="emailInput" type="email" value={this.state.emailInput} onChange={this.handleInputChange}>
            </input>
          </label>

          <label>
            Organization:
            <input id="orgInput" type="text" value={this.state.organizationInput} onChange={this.handleInputChange}>
            </input>
          </label>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <th>
                  First name
                        </th>
                <th>
                  Last name
                        </th>
                <th>
                  Email
                        </th>
                <th>
                  Organization
                        </th>
              </tr>
              {searchResults}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
