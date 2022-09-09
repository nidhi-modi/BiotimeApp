import React from "react";
import Table from "react-bootstrap/Table";

export const Employees = ({ employees }) => {
  const EmployeeRow = (employee, index) => {
    return (
      <tr key={index} className="even">
        <td> {index + 1} </td>
        <td>{employee.date}</td>
        <td>{employee.employeenumber}</td>
        <td>{employee.employeename}</td>
        <td>{employee.hcostcentre}</td>
        <td>{employee.paycodeid}</td>
        <td>{employee.start}</td>
        <td>{employee.finish}</td>
        <td>{employee.hours}</td>
      </tr>
    );
  };

  const EmployeeTable = employees.map((cust, index) =>
    EmployeeRow(cust, index)
  );

  const tableHeader = (
    <thead className="bgvi">
      <tr>
        <th>#</th>
        <th>Date</th>
        <th>Employee Number</th>
        <th>Name</th>
        <th>Department</th>
        <th>Paycode</th>
        <th>Start</th>
        <th>Finish</th>
        <th>Hours</th>
      </tr>
    </thead>
  );

  return (
    <Table striped bordered hover>
      {tableHeader}
      <tbody>{EmployeeTable}</tbody>
    </Table>
  );
};
