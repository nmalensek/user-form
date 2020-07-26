import React from 'react';
import './App.css';
import axios from 'axios';
import BasicUserData from './BasicUserData';
import SearchResult from './SearchResult.js';
import DetailsWindow from './DetailsWindow.js';
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

  //open the edit/details popup on edit button click and populate fields, don't change anything yet. Using find is ok because ids are unique.
  handleEditClick(id, e) {
    let userToEdit = this.state.users.find((user) => {
      return user.id === id;
    });
    this.setState({
      editUser: userToEdit
    });
  }

  cancelEdit(e) {
    this.setState({
      editUser: null
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
