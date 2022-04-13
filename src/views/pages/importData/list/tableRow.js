import React, { Component } from "react";

class TableRow extends Component {
  render() {
    var row = this.props.row;

    const tdStyle = {
      border: "1px solid #85C1E9",
      background: "white",
      padding: "5px",
    };
    return (
      <tr>
        {row.map((val) => (
          <td style={tdStyle}>{val}</td>
        ))}
      </tr>
    );
  }
}

export default TableRow;
