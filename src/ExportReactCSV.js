import React from "react";
import { CSVLink } from "react-csv";
import Button from "react-bootstrap/Button";

export const ExportReactCSV = ({ csvData, fileName }) => {
  return (
    <Button variant="warning" size="lg">
      <CSVLink data={csvData} filename={fileName}>
        Export Data
      </CSVLink>
    </Button>
  );
};
