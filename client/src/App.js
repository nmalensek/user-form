import React from 'react';
import './App.css';
import axios from 'axios';
import SearchResult from './SearchResult.js';
import Validation from './Validation.js';
import * as Constants from './StringMessages.js';
import ProcessServerError from "./ProcessServerError";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      inputs: {},
      inputErrors: {},
      triedToSubmit: false,
      submissionSuccessful: false,
      submissionServerErrors: [],
      actionCompleteMessage: ''
    }

    let dicts = this.resetInputDicts(this.inputData);
    
    this.state.inputErrors = dicts.errorDict;
    this.state.inputs = dicts.inputDict;

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  // inputs are tracked based on their name tag values. Storing validation functions
  // in a dictionary to make validation code easier to write.
  inputData = {
    firstNameInput: {name: 'firstNameInput', func: Validation.requiredValidName},
    lastNameInput: {name: 'lastNameInput', func: Validation.requiredValidName},
    emailInput: {name: 'emailInput', func: Validation.requiredValidEmail},
    orgInput: {name: 'orgInput', func: Validation.requiredValidOrg}
  }

/*
    set inputs having errors as true (all are required for successful submission)
    and set input values to empty strings so they're managed components for their entire lifecycle. Use this in the constructor and on successful form submission.
*/
  resetInputDicts(source) {
    let newErrors = {};
    let newInputDict = {};
    Object.values(source).forEach((val) => {
      newErrors[val.name] = true
      newInputDict[val.name] = ''
    });

    return {
      errorDict: newErrors,
      inputDict: newInputDict
    };
  }

  resetForm() {
    let newDicts = this.resetInputDicts(this.inputData);

    this.setState({
      inputErrors: newDicts.errorDict,
      inputs: newDicts.inputDict,
      triedToSubmit: false,
      submissionServerErrors: []
    });
  }

  createNewUserFromInputs() {
    return {
      firstName: this.state.inputs[this.inputData.firstNameInput.name],
      lastName: this.state.inputs[this.inputData.lastNameInput.name],
      email: this.state.inputs[this.inputData.emailInput.name],
      organization: this.state.inputs[this.inputData.orgInput.name]
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

  handleNewUserSubmit() {
    //only show validation errors when a user tries to submit the form.
    let errors = this.state.inputErrors;

    Object.keys(this.state.inputs).forEach((val) => {
      if (this.inputData[val].func(this.state.inputs[val])) {
        delete errors[val];
      } else {
        errors[val] = true;
      }
    });
    this.setState({inputErrors: errors});

    if (Object.keys(this.state.inputErrors).length !== 0) {
      this.setState({
        triedToSubmit: true,
        submissionSuccessful: false
      });
      return;
    }

    axios.post('/users', this.createNewUserFromInputs())
      .then(() => {
        this.setState({
          submissionSuccessful: true,
          actionCompleteMessage: Constants.userAdded
        });
        this.resetForm();
        this.getAllUsers();
      })
      .catch(err => {
        let errors = ProcessServerError.getServerErrorAsArray(err, Constants);

        this.setState({
          submissionServerErrors: errors,
          submissionSuccessful: false,
          triedToSubmit: true
        });
      });
  }

  handleUserDelete(id, fullName, e) {
    axios.delete('/users/' + id)
    .then(() => {
        this.setState({
          submissionSuccessful: true,
          actionCompleteMessage: Constants.getPersonalizedUserDeletedMessage(fullName),
          submissionServerErrors: []
        });
        this.getAllUsers();
      })
    .catch(err => {
      let errors = ProcessServerError.getServerErrorAsArray(err, Constants);
      
      this.setState({
        submissionServerErrors: errors,
        submissionSuccessful: false,
      });
    });
  }

  handleUserChange(id, e) {
    axios.put('/users/' + id).then(
      //probably refactor user creation function at least partially to reuse it here.
    );
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
    });

    const serverErrors = this.state.submissionServerErrors.map((err, ind) => {
      return (
        <p key={ind}>{err}</p>
      )
    });

    return (
      <div className='App'>
        <div>
          <h1>
            User Management
          </h1>
        </div>
        <div className='newUser'>
          <div>
          <span>
          <label>
            First Name:
            <input id='firstNameInput' name={this.inputData.firstNameInput.name} type='text' maxLength='200'
            value={this.state.inputs[this.inputData.firstNameInput.name]} 
            onChange={this.handleTextInputChange}>
            </input>
          </label>
          </span>
          <div id='firstNameError' name='firstNameError' className={this.state.inputErrors[this.inputData.firstNameInput.name] && this.state.triedToSubmit ? 'active-error' : 'inactive-message'}>* Please enter a first name.</div>
          <span>
          <label>
            Last Name:
            <input id='lastNameInput' name={this.inputData.lastNameInput.name} type='text' maxLength='200'
            value={this.state.inputs[this.inputData.lastNameInput.name]} 
            onChange={this.handleTextInputChange}>
            </input>
          </label>
          <div id='lastNameError' name='lastNameError' className={this.state.inputErrors[this.inputData.lastNameInput.name] && this.state.triedToSubmit ? 'active-error' : 'inactive-message'}>* Please enter a last name.</div>
          </span>
          </div>

          <div>
            <span>
          <label>
            Email:
            <input id='emailInput' name={this.inputData.emailInput.name} type='email' value={this.state.inputs[this.inputData.emailInput.name]} onChange={this.handleTextInputChange}>
            </input>
            <div id='emailError' name='emailError' className={this.state.inputErrors[this.inputData.emailInput.name] && this.state.triedToSubmit ? 'active-error' : 'inactive-message'}>* Please enter a valid email address.</div>
          </label>
            </span>
            <span>
          <label>
            Organization:
            <input id='orgInput' name={this.inputData.orgInput.name} type='text' value={this.state.inputs[this.inputData.orgInput.name]} onChange={this.handleTextInputChange}>
            </input>
          </label>
              <div id='orgError' name='orgError' className={this.state.inputErrors[this.inputData.orgInput.name] && this.state.triedToSubmit ? 'active-error' : 'inactive-message'}>* Please enter an organization name.</div>
            </span>
          </div>
        </div>
        <div>
          <input type='button' value='Create new user' onClick={this.handleNewUserSubmit} ></input>
        </div>
        <div className={'user-submission ' + (this.state.submissionSuccessful ? 'success' : 'failure')}>
            {this.state.submissionSuccessful ? this.state.actionCompleteMessage : ''}
            {this.state.submissionServerErrors.length > 0 ? serverErrors : ''}
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
