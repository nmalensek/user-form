import React from 'react';
import './App.css';

class SearchResult extends React.Component {
    fullName = this.props.user.firstName + ' ' + this.props.user.lastName;
    render() {
        return (
            <tr>
                <td>
                    {this.props.user.firstName}
                </td>
                <td>
                    {this.props.user.lastName}
                </td>
                <td>
                    {this.props.user.email}
                </td>
                <td>
                    {this.props.user.organization}
                </td>
                <td>
                    <input type="button" onClick={this.props.editFunc.bind(this, this.props.user.id)} value="Edit"></input>
                </td>
                <td>
                    <input type="button" onClick={this.props.deleteFunc.bind(this, this.props.user.id, this.fullName)} value="Delete"></input>
                </td>
            </tr>
        )
    }
}

export default SearchResult;