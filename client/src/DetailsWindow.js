import React from 'react';
import './App.css';

class DetailsWindow extends React.Component {
    render() {
        return (
            <div className={'edit-popup'}>
                <h4>
                    Currently editing {this.props.user.firstName + ' ' + this.props.user.lastName}
                </h4>
                <div>
                    <label>
                        First name:
                        {/* <input type='text' value={this.props.user.firstName}>

                        </input> */}
                    </label>
                </div>
                <div>

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