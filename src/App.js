import React from "react";
import "./App.css";
import { Employees } from "./Employees";
import { Header } from "./Header";
import { ExportReactCSV } from "./ExportReactCSV";
import Button from "react-bootstrap/Button";
import moment from "moment";
var base64 = require("base-64");

const username = "karenfapi";
const password = "08SruEA3pyK%";
var weekNum, lastWeekNum;

class App extends React.Component {
  employees = () => {
    let custs = [];
    for (let i = 0; i <= 25; i++) {
      custs.push({
        date: `date${i}`,
        employeenumber: `number${i}`,
        employeename: `name${i}`,
        hcostcentre: `000${i}12`,
        paycodeid: `REG${i}`,
        start: `01/02/${i}`,
        finish: `05/08/${i}`,
        hours: `1${i}`,
      });
    }
    return custs;
  };

  getEmployees = async (startDate, endDate) => {
    try {
      const response = await fetch(
        "https://tandg.mybiotime.com/api/pay?filter=wlevel1 eq 2200",
        {
          method: "GET",
          mode: "no-cors",
          headers: {
            Authorization: "Basic " + base64.encode(username + ":" + password),
          },
        }
      );

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  getDateFromLastWeek() {
    var weekNumber = moment().week() - 3;
    var yearNumber = moment().year();

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployees(formattedStartDate, formattedEndDate);
  }

  getDateFromThisWeek() {
    var weekNumber = moment().week() - 2;
    var yearNumber = moment().year();

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployees(formattedStartDate, formattedEndDate);
  }

  getStartDateOfWeek(weekNumber, year) {
    return new Date(year, 0, 3 + (weekNumber - 1) * 7);
  }

  getEndDateOfWeek(weekNumber, year) {
    return new Date(year, 0, 9 + (weekNumber - 1) * 7);
  }

  getWeekNumbers() {
    var weekNumber = moment().week() - 1;
    var yearNumber = moment().year();
    var toText = yearNumber.toString(); //convert to string
    var lastChar = toText.slice(-2); //gets last character
    var lastDigit = +lastChar; //convert last character to number
    var weekNumberText = lastDigit + "00";
    var convertWeekNumber = +weekNumberText;
    var completeWeekNumber = convertWeekNumber + weekNumber;
    var lastWeekNumber = completeWeekNumber - 1;
    var thisWeekNumber = lastWeekNumber - 1;

    weekNum = thisWeekNumber;
    lastWeekNum = lastWeekNumber;
  }

  state = {
    employees: this.employees(),
    fileName: "Employees",
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="row">
          <div className="col-md-8">
            <h3>Select Week Number : </h3> &nbsp;&nbsp;&nbsp;
            <text onClick={this.getWeekNumbers()}></text>
            <Button
              className="btnSize"
              variant="success"
              size="lg"
              active
              onClick={() => this.getDateFromLastWeek()}
            >
              {weekNum}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              className="btnSize"
              variant="success"
              size="lg"
              active
              onClick={() => this.getDateFromThisWeek()}
            >
              {lastWeekNum}
            </Button>
          </div>
          <br />
          <br />
          <br />
          <div className="col-md-4 center">
            <ExportReactCSV
              csvData={this.state.employees}
              fileName={this.state.fileName}
            />
          </div>
        </div>
        <Employees employees={this.employees()} />
      </div>
    );
  }
}

export default App;
