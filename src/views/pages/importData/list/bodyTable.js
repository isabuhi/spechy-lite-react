import React, { Component } from "react";
import TableRow from "./tableRow";

class BodyTable extends Component {
  render() {
    var heading = this.props.heading;
    var body = this.props.body;

    const tableStyle = {
      border: "1px solid black",
      borderCollapse: "collapse",
      textAlign: "center",
      width: "100%",
    };

    const thStyle = {
      border: "1px solid #7367f0",
      background: "#7367f0",
      color: "white",
      padding: "5px",
    };

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            {heading.map((head) => (
              <th style={thStyle}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <TableRow row={row} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default BodyTable;
