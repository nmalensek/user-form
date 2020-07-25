import React from 'react';
import './App.css';

class DetailsWindow extends React.Component {
    render() {
        return (
            <div className={'edit-popup ' + (this.props.user === undefined ? 'inactive' : 'active')}>

        </div>
        )
    }
}

export default DetailsWindow;