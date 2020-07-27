import React from 'react';
import './App.css';

class BasicUserData extends React.Component {
    render() {
        return(
            <div>
                <div>
                <span>
                <label>
                    First Name:
                    <input id={this.props.inputData.firstNameInput.name} name={this.props.inputData.firstNameInput.name} type='text' maxLength='200'
                    value={this.props.inputs[this.props.inputData.firstNameInput.name]} 
                    onChange={this.props.handleTextInputChange}>
                    </input>
                </label>
                </span>
                <div id={this.props.inputData.firstNameInput.name + 'Error'} name={this.props.inputData.firstNameInput.name + 'Error’'} className={this.props.inputErrors[this.props.inputData.firstNameInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                * Please enter a first name.
                </div>
                
                <span>
                <label>
                Last Name:
                <input id={this.props.inputData.lastNameInput.name} name={this.props.inputData.lastNameInput.name} type='text' maxLength='200'
                value={this.props.inputs[this.props.inputData.lastNameInput.name]} 
                onChange={this.props.handleTextInputChange}>
                </input>
                </label>
                <div id={this.props.inputData.lastNameInput.name + 'Error'} name={this.props.inputData.lastNameInput.name + 'Error'} className={this.props.inputErrors[this.props.inputData.lastNameInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                * Please enter a last name.
                </div>
                </span>
            </div>

                <div>
                <span>
                <label>
                    Email:
                    <input id={this.props.inputData.emailInput.name} name={this.props.inputData.emailInput.name} type='email' value={this.props.inputs[this.props.inputData.emailInput.name]} onChange={this.props.handleTextInputChange}>
                    </input>
                    <div id={this.props.inputData.emailInput.name + 'Error'} name={this.props.inputData.emailInput.name + 'Error'} className={this.props.inputErrors[this.props.inputData.emailInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                    * Please enter a valid email address.
                    </div>
                </label>
                </span>

                <span>
                    <label>
                    Organization:
                    <input id={this.props.inputData.orgInput.name} name={this.props.inputData.orgInput.name} type='text' value={this.props.inputs[this.props.inputData.orgInput.name]} onChange={this.props.handleTextInputChange}>
                    </input>
                    </label>
                    <div id={this.props.inputData.orgInput.name + 'Error'} name={this.props.inputData.orgInput.name + 'Error'} className={this.props.inputErrors[this.props.inputData.orgInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                    * Please enter an organization name.
                    </div>
                </span>
                </div>
            </div>
        )
    }
}

export default BasicUserData;