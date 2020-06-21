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

  inputNames = {
    firstName: 'firstNameInput',
    lastName: 'lastNameInput',
    email: 'emailInput',
    org: 'orgInput'
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
    let errors = this.state.inputErrors;
    
    //TODO: figure out how to store validation functions in a dictionary
    //to get rid of element name checks (ran into trouble with 'this' scope
    //and functions being undefined).
    if (e.target.name === this.inputNames.email) {
      if (!Validation().requiredValidEmail(e.target.value)) {
        errors[e.target.name] = true;
      } else {
        errors[e.target.name] = false;
      }
    }

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
          <span>
          <label>
            First Name:
            <input id='firstNameInput' name={this.inputNames.firstName} type='text' 
            value={this.state.inputs[this.inputNames.firstName]  || ''} 
            onChange={this.handleTextInputChange}>
            </input>
          </label>
          </span>
          

          <label>
            Last Name:
            <input id='lastNameInput' name={this.inputNames.lastName} type='text' 
            value={this.state.inputs[this.inputNames.lastName]  || ''} 
            onChange={this.handleTextInputChange}>
            </input>
          </label>
        
          <label>
            Email:
            <input id='emailInput' name={this.inputNames.email} type='email' value={this.state.inputs[this.inputNames.email] || ''} onChange={this.handleTextInputChange}>
            </input>
            {/* <div id='emailError' name='emailError' style={this.state.inputErrors[this.inputNames.email] !== 'undefined' ? display:'none' : display: 'block'}>* Please enter a valid email address.</div> */}
            <div id='emailError' name='emailError' className={this.state.inputErrors[this.inputNames.email] ? 'active-error' : 'inactive-error'}>* Please enter a valid email address.</div>
          </label>

          <label>
            Organization:
            <input id='orgInput' name={this.inputNames.org} type='text' value={this.state.inputs[this.inputNames.org] || ''} onChange={this.handleTextInputChange}>
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
