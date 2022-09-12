import React from "react";
import "./App.css";
import { Employees } from "./Employees";
import { Header } from "./Header";
import { ExportReactCSV } from "./ExportReactCSV";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
var base64 = require("base-64");
const cors = require("cors");

const username = "karenfapi";
const password = "08SruEA3pyK%";
var weekNum, lastWeekNum;
var wholeData = [];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      fileName: "Employees",
      dataList: [],
      setLoading: false,
    };
  }

  employees = () => {
    let emp = [];

    this.state.dataList.map((emps) => {
      emp.push({
        date: moment(emps.date).format("yyyy-MM-DD, h:mm:ss a"),
        employeenumber: emps.employeepayrollnumber,
        employeename: emps.employeename,
        hcostcentre: emps.wlevel2description,
        paycodeid: emps.paycodeid,
        start: moment(emps.start).format("h:mm:ss a"),
        finish: moment(emps.finish).format("h:mm:ss a"),
        hours: this.totalHours(emps.start, emps.finish),
      });
    });

    this.setState({
      employees: emp,
    });

    return emp;
  };

  totalHours = (startDate, endDate) => {
    var exactHoursWorked;

    const start = moment(startDate, "yyyy-MM-DD, h:mm:ss A");

    const end = moment(endDate, "yyyy-MM-DD, h:mm:ss A");

    const TotalSeconds = end.diff(start, "seconds");

    var hours = Math.floor(TotalSeconds / 3600);
    var minutes = Math.floor((TotalSeconds / 60) % 60);

    if (minutes !== 0) {
      exactHoursWorked = hours + "." + minutes;
    } else if (hours !== 0) {
      exactHoursWorked = hours;
    } else {
      exactHoursWorked = minutes;
    }

    return exactHoursWorked;
  };

  getEmployees = async (startDate, endDate) => {
    this.setState({
      isLoading: true,
    });
    try {
      const response = await fetch(
        `https://tandg.mybiotime.com/api/pay?filter=wlevel1 eq 2200 and date ge '${startDate}' and date le '${endDate}'`,
        {
          method: "GET",
          //mode: "cors",
          headers: {
            Authorization: "Basic " + base64.encode(username + ":" + password),
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
        }
      );
      this.setState({
        isLoading: true,
      });
      const data = await response.json();
      wholeData = data.Data;
      this.setState({
        dataList: wholeData,
      });
      console.log(wholeData);
      this.setState({
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    } finally {
    }
  };

  getDateFromLastWeek() {
    this.setState({
      isLoading: true,
    });
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
    this.setState({
      isLoading: true,
    });
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

  render() {
    return (
      <div className="App">
        <Header />
        {this.state.isLoading ? (
          <div className="loading-data">
            <ClipLoader
              color={"#ff0000"}
              loading={this.state.isLoading}
              className="override"
              size={80}
            />
          </div>
        ) : (
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
        )}
        <div>
          {this.state.dataList.length > 0 ? (
            <Employees employees={this.employees()} />
          ) : this.state.isLoading ? null : (
            <h4 className="loading-data">
              Select week number to load data here...
            </h4>
          )}
        </div>
      </div>
    );
  }
}

export default App;
