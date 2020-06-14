import React from 'react';
import './App.css';

class SearchResult extends React.Component {

    render() {
        return (
            <tr>
                <td>
                    {this.props.firstName}
                </td>
                <td>
                    {this.props.lastName}
                </td>
                <td>
                    {this.props.email}
                </td>
                <td>
                    {this.props.org}
                </td>
                <td>
                    <input type="button" onClick={this.props.editFunc.bind(this, this.props.id)} value="Edit"></input>
                </td>
                <td>
                    <input type="button" onClick={this.props.deleteFunc.bind(this, this.props.id)} value="Delete"></input>
                </td>
            </tr>
        )
    }
}

export default SearchResult;