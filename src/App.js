import React, { Component } from "react";
import "./App.css";
import { Employees } from "./Employees";
import { Header } from "./Header";
import { CSVLink } from "react-csv";
import { ExportReactCSV } from "./ExportReactCSV";
import { ExportInCSV } from "./ExportCSV";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import schedule from "node-schedule";
import moment from "moment";
import Crontab from "reactjs-crontab";
import "reactjs-crontab/dist/index.css";
var base64 = require("base-64");
const cors = require("cors");

const username = "karenfapi";
const password = "08SruEA3pyK%";
var weekNum, lastWeekNum, currentWeekNumber;
var wholeData = [];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      fileName: "",
      dataList: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    const fileNameWithTimestamp = "Biotime-" + currentWeekNumber;

    this.setState({
      fileName: fileNameWithTimestamp,
    });

    //DEMO

    const currentTime = new Date().getTime(); //current unix timestamp
    const execTime = new Date().setHours(10, 30, 0, 0); //API call time = today at 24:00

    let timeLeft;
    if (currentTime < execTime) {
      //it's currently earlier than 20:00
      timeLeft = execTime - currentTime;
    } else {
      //it's currently later than 20:00, schedule for tomorrow at 20:00
      timeLeft = execTime + 86400000 - currentTime;
    }
    setTimeout(() => {
      this.gettingStarted();
    }, timeLeft);

    console.log(timeLeft);
  }

  gettingStarted = () => {
    var weekNumber = moment().week() - 1;
    var yearNumber = moment().year();

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployees(formattedStartDate, formattedEndDate);
  };

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
      isLoading: false,
    });

    try {
      const response = await fetch(
        `https://tandg.mybiotime.com/api/pay?filter=wlevel1 eq 2200 and date ge '${startDate}' and date le '${endDate}' and wcostcentre in('36412','36411','36416','36417')`,
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

      const data = await response.json();
      wholeData = data.Data;
      this.setState({
        dataList: wholeData,
        isLoading: false,
      });
      console.log("RAW DATA : " + wholeData);

      setTimeout(function () {
        if (this.state.dataList.length > 0) {
          document.getElementById("mainButtonClicked").click();
        }
      }, 2000);
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
      isLoading: false,
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
      isLoading: false,
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
    currentWeekNumber = completeWeekNumber;
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
            <h4 className="loading-data">Loading data please wait...</h4>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              <h3>Current Week Number : </h3>{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <text onClick={this.getWeekNumbers()}></text>
              <Button className="btnSize" variant="success" size="lg">
                {currentWeekNumber}
              </Button>
            </div>
            <br />
            <br />
            <br />

            <div className="col-md-4 center">
              <Button variant="warning" size="lg">
                <CSVLink
                  data={this.state.employees}
                  filename={this.state.fileName}
                  id="mainButtonClicked"
                >
                  Export Data
                </CSVLink>
              </Button>
            </div>
          </div>
        )}
        <div>
          {this.state.dataList.length > 0 ? (
            <Employees employees={this.employees()} />
          ) : this.state.isLoading ? null : (
            <h4 className="loading-data">
              Data will be reloaded at 12 am, Please leave this page open.
            </h4>
          )}
        </div>
      </div>
    );
  }
}

export default App;
