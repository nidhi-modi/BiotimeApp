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
var payCodeWholeData = [];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      fileName: "",
      previousWkFileName: "",
      dataList: [],
      paycodeList: [],
      isLoading: false,
      isoWeek: "",
      previousIsoWeek: "",
      isManualButtonLoading: false,
    };
  }

  componentDidMount() {
    //CURRENT WEEK
    var weekNumber = moment().week();
    var yearNumber = moment().year();
    var toText = yearNumber.toString(); //convert to string
    var lastChar = toText.slice(-2); //gets last character
    var lastDigit = +lastChar; //convert last character to number
    var weekNumberText = lastDigit + "00";
    var convertWeekNumber = +weekNumberText;
    var completeWeekNumber = convertWeekNumber + weekNumber;

    //PREVIOUS WEEK
    var previousWeekNumber = moment().week() - 1;
    var previousCompleteWkNo = convertWeekNumber + previousWeekNumber;

    //FILE NAME
    const fileNameWithTimestamp = "Biotime-" + currentWeekNumber;
    const fileNameWithTimestampPrevious = "Biotime-" + lastWeekNum;

    //DEMO

    //CURRENT WEEK CALLING
    const currentTime = new Date().getTime(); //current unix timestamp
    const execTime = new Date().setHours(0, 0, 0, 0); //API call time = today at 24:00

    let timeLeft;
    if (currentTime < execTime) {
      //it's currently earlier than 20:00
      timeLeft = execTime - currentTime;
    } else {
      //it's currently later than 20:00, schedule for tomorrow at 20:00
      timeLeft = execTime + 86400000 - currentTime;
    }

    //PREVIOUS WEEK CALLING
    const currentTime1 = new Date().getTime(); //current unix timestamp
    const execTime1 = new Date().setHours(0, 5, 0, 0); //API call time = today at 24:00

    let timeLeft1;
    if (currentTime1 < execTime1) {
      //it's currently earlier than 20:00
      timeLeft1 = execTime1 - currentTime1;
    } else {
      //it's currently later than 20:00, schedule for tomorrow at 20:00
      timeLeft1 = execTime1 + 86400000 - currentTime1;
    }

    /*setTimeout(() => {
      console.log("Current Week");
      this.setState({
        isoWeek: completeWeekNumber,
        fileName: fileNameWithTimestamp,
      });
      this.gettingStarted();
    }, timeLeft);

    setTimeout(() => {
      console.log("Last Week");
      this.setState({
        isoWeek: previousCompleteWkNo,
        fileName: fileNameWithTimestampPrevious,
      });
      this.gettingStartedPrevious();
    }, timeLeft1);

    console.log("Current Week: " + timeLeft + " Last week: " + timeLeft1);
    console.log(
      "API calls are done @12am and the other one is called @12:05am"
    );*/

    console.log("Loading API, Please wait...");
    setInterval(() => {
      this.setState({
        isoWeek: completeWeekNumber,
        fileName: fileNameWithTimestamp,
      });
      this.gettingStarted();
    }, 3600000);
  }

  gettingStartedPrevious = () => {
    //Loading for button
    this.setState({ isLoading: true });
    var weekNumber = moment().week() - 1;
    var yearNumber = moment().year();

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployeesPrevious(formattedStartDate, formattedEndDate);
  };

  gettingStarted = () => {
    //Loading for button
    this.setState({ isLoading: true });
    var weekNumber = moment().week();
    var yearNumber = moment().year();

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployees(formattedStartDate, formattedEndDate);
  };

  gettingManuallyStarted = () => {
    //SETUP_TESTS

    //CURRENT WEEK
    var weekNumber = moment().week();
    var yearNumber = moment().year();
    var toText = yearNumber.toString(); //convert to string
    var lastChar = toText.slice(-2); //gets last character
    var lastDigit = +lastChar; //convert last character to number
    var weekNumberText = lastDigit + "00";
    var convertWeekNumber = +weekNumberText;
    var completeWeekNumber = convertWeekNumber + weekNumber;

    //FILE NAME
    const fileNameWithTimestamp = "Biotime-" + currentWeekNumber;

    this.setState({
      isoWeek: completeWeekNumber,
      fileName: fileNameWithTimestamp,
    });
    //
    //Loading for button
    this.setState({ isManualButtonLoading: true });

    var weekNumber = moment().week();
    var yearNumber = moment().year();

    console.log("Current Week: " + weekNumber);
    console.log("Current Year: " + yearNumber);

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getManuallyEmployees(formattedStartDate, formattedEndDate);
  };

  gettingManuallyStartedPrevious = () => {
    //SETUP_TESTS
    //CURRENT WEEK
    var weekNumber = moment().week();
    var yearNumber = moment().year();
    var toText = yearNumber.toString(); //convert to string
    var lastChar = toText.slice(-2); //gets last character
    var lastDigit = +lastChar; //convert last character to number
    var weekNumberText = lastDigit + "00";
    var convertWeekNumber = +weekNumberText;

    //PREVIOUS WEEK
    var previousWeekNumber = moment().week() - 1;
    var previousCompleteWkNo = convertWeekNumber + previousWeekNumber;

    //FILE NAME
    const fileNameWithTimestampPrevious = "Biotime-" + previousCompleteWkNo;
    //

    this.setState({
      isoWeek: previousCompleteWkNo,
      fileName: fileNameWithTimestampPrevious,
    });
    //Loading for button
    this.setState({ isManualButtonLoading: true });

    var weekNumber = moment().week() - 1;
    var yearNumber = moment().year();

    console.log("Previous Week: " + weekNumber);
    console.log("Previous Year: " + yearNumber);

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getManuallyEmployeesPrevious(formattedStartDate, formattedEndDate);

    console.log("Hello?");
  };

  employees = () => {
    let emp = [];

    this.state.dataList.map((emps) => {
      emp.push({
        date: moment(emps.date).format("yyyy-MM-DD, h:mm:ss a"),
        ISOWeek: this.state.isoWeek,
        employeenumber: emps.employeepayrollnumber,
        employeename: emps.employeename,
        hcostcentre: emps.wlevel2description,
        paycodeid: this.getPayCode(emps.type, emps.code),
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

  getPayCode = (type, code) => {
    var payCodeID = "";
    var idName = "";

    if (type === "") {
      payCodeID = code;
    } else {
      payCodeID = type + "|" + code;
    }

    this.state.paycodeList.filter((payId) => {
      if (payId.transfercode === payCodeID) {
        idName = payId.name;
      }
    });

    return idName;
  };

  totalHours = (startDate, endDate) => {
    var exactHoursWorked;

    const start = moment(startDate, "yyyy-MM-DD, h:mm:ss A");

    const end = moment(endDate, "yyyy-MM-DD, h:mm:ss A");

    const TotalSeconds = end.diff(start, "seconds");

    var hours = Math.floor(TotalSeconds / 3600);
    var minutes = Math.floor((TotalSeconds / 60) % 60);
    var manualMinutes;

    if (minutes === 15) {
      manualMinutes = 25;
    } else if (minutes === 30) {
      manualMinutes = 50;
    } else if (minutes === 45) {
      manualMinutes = 75;
    } else {
      manualMinutes = 0;
    }

    if (minutes !== 0) {
      exactHoursWorked = hours + "." + manualMinutes;
    } else if (hours !== 0) {
      exactHoursWorked = hours;
    } else {
      exactHoursWorked = manualMinutes;
    }

    return exactHoursWorked;
  };

  getEmployeesPrevious = async (startDate, endDate) => {
    //SETUP_TESTS
    //CURRENT WEEK
    var weekNumber = moment().week();
    var yearNumber = moment().year();
    var toText = yearNumber.toString(); //convert to string
    var lastChar = toText.slice(-2); //gets last character
    var lastDigit = +lastChar; //convert last character to number
    var weekNumberText = lastDigit + "00";
    var convertWeekNumber = +weekNumberText;

    //PREVIOUS WEEK
    var previousWeekNumber = moment().week() - 1;
    var previousCompleteWkNo = convertWeekNumber + previousWeekNumber;

    //FILE NAME
    const fileNameWithTimestampPrevious = "Biotime-" + lastWeekNum;
    //

    this.setState({
      isoWeek: previousCompleteWkNo,
      fileName: fileNameWithTimestampPrevious,
    });
    this.setState({
      isLoading: false,
    });

    try {
      const paycodeResponse = await fetch(
        `https://tandg.mybiotime.com/api/paycode`,
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

      const paycodeData = await paycodeResponse.json();
      payCodeWholeData = paycodeData.Data;
      this.setState({
        paycodeList: payCodeWholeData,
        isLoading: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    } finally {
    }

    //PAYCODE
    this.setState({
      isLoading: true,
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

      setTimeout(function () {
        document.getElementById("mainButtonClicked").click();
      }, 1000);

      //REFRESH PAGE AFTER 15 Sec
      setTimeout(function () {
        window.location.reload();
      }, 15000);
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    } finally {
    }
  };

  getManuallyEmployeesPrevious = async (startDate, endDate) => {
    this.setState({
      isManualButtonLoading: true,
    });

    try {
      const paycodeResponse = await fetch(
        `https://tandg.mybiotime.com/api/paycode`,
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

      const paycodeData = await paycodeResponse.json();
      payCodeWholeData = paycodeData.Data;
      this.setState({
        paycodeList: payCodeWholeData,
        isManualButtonLoading: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isManualButtonLoading: false,
      });
    } finally {
    }

    //PAYCODE
    this.setState({
      isManualButtonLoading: true,
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
        isManualButtonLoading: false,
      });

      setTimeout(function () {
        document.getElementById("mainButtonClicked").click();
      }, 1000);

      //REFRESH PAGE AFTER 15 Sec
      setTimeout(function () {
        window.location.reload();
      }, 15000);
    } catch (error) {
      console.error(error);
      this.setState({
        isManualButtonLoading: false,
      });
    } finally {
    }
  };

  getManuallyEmployees = async (startDate, endDate) => {
    this.setState({
      isManualButtonLoading: true,
    });

    try {
      const paycodeResponse = await fetch(
        `https://tandg.mybiotime.com/api/paycode`,
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

      const paycodeData = await paycodeResponse.json();
      payCodeWholeData = paycodeData.Data;
      this.setState({
        paycodeList: payCodeWholeData,
        isManualButtonLoading: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isManualButtonLoading: false,
      });
    } finally {
    }

    //PAYCODE
    this.setState({
      isManualButtonLoading: true,
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
        isManualButtonLoading: false,
      });

      setTimeout(function () {
        document.getElementById("mainButtonClicked").click();
      }, 500);

      //REFRESH PAGE AFTER 15 Sec
      setTimeout(() => {
        this.gettingManuallyStartedPrevious();
      }, 15000);
    } catch (error) {
      console.error(error);
      this.setState({
        isManualButtonLoading: false,
      });
    } finally {
    }
  };

  getEmployees = async (startDate, endDate) => {
    this.setState({
      isLoading: false,
    });

    try {
      const paycodeResponse = await fetch(
        `https://tandg.mybiotime.com/api/paycode`,
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

      const paycodeData = await paycodeResponse.json();
      payCodeWholeData = paycodeData.Data;
      this.setState({
        paycodeList: payCodeWholeData,
        isLoading: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    } finally {
    }

    //PAYCODE
    this.setState({
      isLoading: true,
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

      setTimeout(function () {
        document.getElementById("mainButtonClicked").click();
      }, 500);

      //REFRESH PAGE AFTER 15 Sec
      setTimeout(() => {
        //window.location.reload();
        this.gettingStartedPrevious();
      }, 15000);
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
    var yearNumber = moment().year;

    console.log("Previous Week: " + weekNumber);
    console.log("Previous Year: " + yearNumber);

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

    console.log("Current Week: " + weekNumber);
    console.log("Current Year: " + yearNumber);

    //2016-01-01
    const startDate = this.getStartDateOfWeek(weekNumber, yearNumber);
    const endDate = this.getEndDateOfWeek(weekNumber, yearNumber);

    const formattedStartDate = moment(startDate).format("yyyy-MM-DD");
    const formattedEndDate = moment(endDate).format("yyyy-MM-DD");

    this.getEmployees(formattedStartDate, formattedEndDate);
  }

  getStartDateOfWeek(weekNumber, year) {
    return new Date(year, -1, 30 + (weekNumber - 1) * 7);
  }

  getEndDateOfWeek(weekNumber, year) {
    return new Date(year, 0, 5 + (weekNumber - 1) * 7);
  }

  getWeekNumbers() {
    var weekNumber = moment().week();
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                variant="dark"
                size="lg"
                disabled={this.state.isManualButtonLoading}
                onClick={() =>
                  !this.state.isManualButtonLoading
                    ? this.gettingManuallyStarted()
                    : null
                }
              >
                {this.state.isManualButtonLoading
                  ? "Loading..."
                  : "Manual Export"}
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
