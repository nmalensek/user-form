import React from 'react';
import './App.css';

class BasicUserData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return(
            <div>
                <div>
                <span>
                <label>
                    First Name:
                    <input id='firstNameInput' name={this.props.inputData.firstNameInput.name} type='text' maxLength='200'
                    value={this.props.inputs[this.props.inputData.firstNameInput.name]} 
                    onChange={this.props.handleTextInputChange}>
                    </input>
                </label>
                </span>
                <div id='firstNameError' name='firstNameError' className={this.props.inputErrors[this.props.inputData.firstNameInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                * Please enter a first name.
                </div>
                
                <span>
                <label>
                Last Name:
                <input id='lastNameInput' name={this.props.inputData.lastNameInput.name} type='text' maxLength='200'
                value={this.props.inputs[this.props.inputData.lastNameInput.name]} 
                onChange={this.props.handleTextInputChange}>
                </input>
                </label>
                <div id='lastNameError' name='lastNameError' className={this.props.inputErrors[this.props.inputData.lastNameInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                * Please enter a last name.
                </div>
                </span>
            </div>

                <div>
                <span>
                <label>
                    Email:
                    <input id='emailInput' name={this.props.inputData.emailInput.name} type='email' value={this.props.inputs[this.props.inputData.emailInput.name]} onChange={this.props.handleTextInputChange}>
                    </input>
                    <div id='emailError' name='emailError' className={this.props.inputErrors[this.props.inputData.emailInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                    * Please enter a valid email address.
                    </div>
                </label>
                </span>

                <span>
                    <label>
                    Organization:
                    <input id='orgInput' name={this.props.inputData.orgInput.name} type='text' value={this.props.inputs[this.props.inputData.orgInput.name]} onChange={this.props.handleTextInputChange}>
                    </input>
                    </label>
                    <div id='orgError' name='orgError' className={this.props.inputErrors[this.props.inputData.orgInput.name] && this.props.triedToSubmit ? 'active-error' : 'inactive-message'}>
                    * Please enter an organization name.
                    </div>
                </span>
                </div>
            </div>
        )
    }
}

export default BasicUserData;