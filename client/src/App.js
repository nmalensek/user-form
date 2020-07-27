import React from 'react';
import './App.css';
import axios from 'axios';
import BasicUserData from './BasicUserData';
import SearchResult from './SearchResult.js';
import DetailsWindow from './DetailsWindow.js';
import Validation from './Validation.js';
import * as Constants from './StringMessages.js';
import ProcessServerError from './ProcessServerError';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      inputs: {},
      inputErrors: {},
      triedToSubmit: false,
      triedToEdit: false,
      submissionSuccessful: false,
      submissionServerErrors: [],
      actionCompleteMessage: '',
    }

    let dicts = this.resetInputDicts(this.inputData);
    
    this.state.inputErrors = dicts.errorDict;
    this.state.inputs = dicts.inputDict;

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
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

  editInputs = {
    firstNameInput: {name: 'editFirstNameInput', func: Validation.requiredValidName},
    lastNameInput: {name: 'editLastNameInput', func: Validation.requiredValidName},
    emailInput: {name: 'editEmailInput', func: Validation.requiredValidEmail},
    orgInput: {name: 'editOrgInput', func: Validation.requiredValidOrg}
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

  //Go through the given dictionary and return a dictionary of inputs with errors.
  //Remove inputs from the dictionary if they have a valid value for easier processing later.
  getErrorsFromInputDict(inputDict, targetDict, validationDict) {
    let errors = targetDict;
    
    Object.keys(validationDict).forEach((key) => {
      let val = validationDict[key];
      if(val.func(inputDict[val.name])) {
        delete errors[val.name];
      } else {
        errors[val.name] = true;
      }
    });

    return errors;
  }

  //if a user has a single quote in their name, it won't render correctly unless the HTML is decoded.
  //decodes each object's properties and modifies the given array in-place. This method does not execute script tags if present.
  decodeObjectProperties(objectArray) {
    let doc = new DOMParser()
    
    objectArray.forEach((item) => {
      Object.keys(item).forEach((k) => {
        item[k] = doc.parseFromString(item[k], 'text/html').documentElement.textContent;
      });
    }); 
  }

  getAllUsers() {
    axios.get('/users').then(res => {
      this.decodeObjectProperties(res.data);
      this.setState({
        users: res.data
      });
    });
  // fetch('/users').then(res => {
  //   return res.json()
  // })
  // .then(data => {
  //   this.setState({
  //     users: data
  //   });
  // });
  }

  handleTextInputChange(e) {
    let inputDict = this.state.inputs;
    inputDict[e.target.name] = e.target.value;
    this.setState({
      inputDict
    });
  }

  handleNewUserSubmit() {
    let currErrs = this.getErrorsFromInputDict(this.state.inputs, this.state.inputErrors, this.inputData);
    this.setState({inputErrors: currErrs});

    //if there's an entry in the dictionary that isn't specific to the edit form, 
    //there's invalid new user input so reject the submission.
    if (Object.keys(this.state.inputErrors).some((val) => !val.startsWith('edit'))) {
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

  //open the edit/details popup on edit button click and populate fields, don't change anything yet because user can still cancel out. Reset edit state on each edit click.
  handleEditClick(id, e) {
    let userToEdit = this.state.users.find(user => user.id === id);
    let inputsValues = this.state.inputs;
    inputsValues[this.editInputs['firstNameInput'].name] = userToEdit.firstName;
    inputsValues[this.editInputs['lastNameInput'].name] = userToEdit.lastName;
    inputsValues[this.editInputs['emailInput'].name] = userToEdit.email;
    inputsValues[this.editInputs['orgInput'].name] = userToEdit.organization;
    
    this.setState({
      editUser: userToEdit,
      inputs: inputsValues,
      triedToEdit: false
    });
  }

  cancelEdit(e) {
    this.setState({
      editUser: null
    });
  }

  handleUserChange(e) {
    let editErrs = this.getErrorsFromInputDict(this.state.inputs, this.state.inputErrors, this.editInputs);
    this.setState({
      inputErrors: editErrs
    });

    //if there's an entry in the dictionary specific to the edit form, 
    //an invalid change was made so reject the submission.
    if (Object.keys(this.state.inputErrors).some((val) => val.startsWith('edit'))) {
      this.setState({
        triedToEdit: true,
        submissionSuccessful: false
      });
      return;
    }

    axios.put('/users/' + this.state.editUser.id).then(
      //probably refactor user creation function at least partially to reuse it here.
    );
  }

  render() {
    const searchResults = this.state.users.map((user, ind) => {
      return (
        <SearchResult
          key={ind}
          user={user}
          deleteFunc={this.handleUserDelete}
          editFunc={this.handleEditClick}
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
          <BasicUserData 
            inputData={this.inputData}
            inputs={this.state.inputs}
            inputErrors={this.state.inputErrors}
            handleTextInputChange={this.handleTextInputChange}
            triedToSubmit={this.state.triedToSubmit}
          />
        </div>

        <div>
          <input type='button' value='Create new user' onClick={this.handleNewUserSubmit}></input>
        </div>

        <div className={'user-submission ' + (this.state.submissionSuccessful ? 'success' : 'failure')}>
            {this.state.submissionSuccessful ? this.state.actionCompleteMessage : ''}
            {this.state.submissionServerErrors.length > 0 ? serverErrors : ''}
        </div>
        
        {this.state.editUser && <DetailsWindow
          user={this.state.editUser}
          editData={this.editInputs}
          inputs={this.state.inputs}
          inputErrors={this.state.inputErrors}
          handleTextInputChange={this.handleTextInputChange}
          triedToSubmit={this.state.triedToEdit}
          editFunc={this.handleUserChange}
          cancelFunc={this.cancelEdit}
        />
        }
        
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
