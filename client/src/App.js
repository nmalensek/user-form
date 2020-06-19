import React from 'react';
import './App.css';
import axios from 'axios';
import SearchResult from './SearchResult.js';
import Validation from './Validation.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      inputs: {},
      inputErrors: {}
    }

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  createNewUserFromInputs() {
    return {
      firstName: this.state.firstNameInput,
      lastName: this.state.lastNameInput,
      email: this.state.emailInput,
      organization: this.state.orgInput
    }
  }

  getAllUsers() {
    axios.get('/users').then(res => {
      this.setState({
        users: res.data
      });
    });
  }

  handleTextInputChange(e) {
    let inputDict = this.state.inputs;
    inputDict[e.target.name] = e.target.value;
    this.setState({
      inputDict
    });
  }

  handleNewUserSubmit(e) {
    //TODO: do client-side validation
    axios.post('/users', this.createNewUserFromInputs())
      .then(resp => {
        //display success message.
      })
      .catch(err => {
        //show error message on UI.
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
      <div className='App'>
        <div>
          <h1>
            User Management
          </h1>
        </div>
        <div className='newUser'>
          <label>
            First Name:
            <input id='firstNameInput' name='firstNameInput' type='text' value={this.state.inputs['firstNameInput']  || ''} onChange={this.handleTextInputChange}>
            </input>
          </label>

          <label>
            Last Name:
            <input id='lastNameInput' name='lastNameInput' type='text' value={this.state.inputs['lastNameInput']  || ''} onChange={this.handleTextInputChange}>
            </input>
          </label>
        
          <label>
            Email:
            <input id='emailInput' name='emailInput' type='email' value={this.state.inputs['emailInput'] || ''} onChange={this.handleTextInputChange}>
            </input>
            <div id='emailError' name='emailError' style={{display:'none'}}>* Please enter a valid email address.</div>
          </label>

          <label>
            Organization:
            <input id='orgInput' name='orgInput' type='text' value={this.state.inputs['orgInput'] || ''} onChange={this.handleTextInputChange}>
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
