import React from 'react';
import './App.css';
import BasicUserData from './BasicUserData';

class DetailsWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        
        }
    }    

    render() {
        return (
            <div className={'edit-popup'}>
                <h4>
                    Currently editing {this.props.user.firstName + ' ' + this.props.user.lastName}
                </h4>
                <div>
                    <BasicUserData
                        triedToSubmit={this.props.triedToSubmit}
                        inputs={this.props.inputs}
                        inputData={this.props.editData}
                        inputErrors={this.props.inputErrors}
                        handleTextInputChange={this.props.handleTextInputChange}
                    />
                </div>
                <div>
                    {/* <input type='button' value='Save Changes'></input> */}
                    <input type='button' value='Cancel' onClick={this.props.cancelFunc}></input>
                </div>
            </div>
        )
    }
}

export default DetailsWindow;