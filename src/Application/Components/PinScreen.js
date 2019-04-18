// @flow

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router-dom";
import { appTheme, gMuiTheme } from "./Styles";
import { signOut, reauthenticateWithEmail } from "../Services/AuthService";
import { setUserPin, resetUserPin } from "../Services/DbService";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

/* eslint-disable func-names */
Number.isInteger =
  Number.isInteger ||
  function(value) {
    return (
      typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value
    );
  };

type PinScreenProps = {
  setLock: () => void,
  authUser: {
    email: string
  },
  user: User
};

export default class PinScreen extends Component<PinScreenProps> {
  constructor() {
    super();
    this.renderPinScreen = this.renderPinScreen.bind(this);
    this.checkPin = this.checkPin.bind(this);
    this.forgotPin = this.forgotPin.bind(this);
    this.removePin = this.removePin.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      forgotPin: false,
      pinValue: "",
      pinMeg: "Enter your PIN",
      pinMegColor: textColor1,
      newPinMeg: "Create your PIN",
      newPinValue: "",
      rePinError: "",
      reenter: false
    };
  }

  componentWillMount() {
    this.props.setLock(true);
  }

  logout() {
    signOut().then(() => {
      this.props.setLock(true);
    });
  }

  forgotPin() {
    const forgotPin = true;
    this.setState({ forgotPin });
  }

  removePin() {
    reauthenticateWithEmail(this.props.authUser.email, this.password.getValue())
      .then(() => {
        resetUserPin(this.props.user, "");
        const forgotPin = false;
        this.setState({ forgotPin });
      })
      .catch(error => {
        const passwordError = error.message;
        this.setState({ passwordError });
      });
  }

  checkPin(value) {
    const pinValue = Number(value);
    if (Number.isInteger(pinValue)) {
      this.setState({ pinValue: value });
      if (value.length === 4) {
        if (this.props.user.pin === value) {
          this.setState({
            pinValue: "",
            pinMeg: "Enter your PIN",
            pinMegColor: textColor1
          });
          this.props.setLock(false);
        } else {
          this.setState({
            pinValue: "",
            pinMeg: "Incorrect Pin",
            pinMegColor: alertColor
          });
        }
      }
    }
  }

  checkNewPin(value) {
    const pinValue = Number(value);
    if (Number.isInteger(pinValue)) {
      this.setState({ pinValue: value });
      if (value.length === 4) {
        if (!this.state.reenter) {
          this.setState({
            pinValue: "",
            newPinValue: value,
            newPinMeg: "Retype your PIN",
            reenter: true
          });
        } else if (this.state.newPinValue === value) {
          this.setState({
            rePinError: "",
            pinValue: "",
            newPinValue: "",
            newPinMeg: "Create your PIN",
            reenter: false
          });
          setUserPin(this.props.user, value);
          this.props.setLock(false);
        } else {
          this.setState({
            rePinError: "The pins entered do not match!",
            pinValue: "",
            newPinValue: "",
            newPinMeg: "Create your PIN",
            reenter: false
          });
        }
      }
    }
  }

  renderPinScreen(user) {
    const subtitleStyle = {
      width: "80%",
      margin: "auto",
      marginTop: 40,
      fontSize: 14,
      lineHeight: "20px",
      color: textColor3
    };

    if (!user)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div style={{ marginTop: 24 }} className="center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    if (user.pin) {
      return (
        <div>
          <h2 style={{ color: this.state.pinMegColor }}>{this.state.pinMeg}</h2>
          <input
            className="pinInput"
            autoFocus
            type="number"
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="----"
            value={this.state.pinValue}
            onInput={event => this.checkPin(event.target.value)}
          />
        </div>
      );
    }
    return (
      <div title="4-digit Number PIN">
        <h2 style={{ color: this.state.pinMegColor }}>
          {this.state.newPinMeg}
        </h2>
        <input
          className="pinInput"
          autoFocus
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="----"
          value={this.state.pinValue}
          onInput={event => this.checkNewPin(event.target.value)}
        />
        <p style={{ fontSize: 12, color: alertColor }}>
          {this.state.rePinError}
        </p>
        <p style={subtitleStyle}>
          We take security very seriously, please create a personal pin.
        </p>
      </div>
    );
  }

  render() {
    if (!this.props.authUser) return null;

    const paperStyle = {
      position: "absolute",
      height: "100vh",
      width: "100vw",
      top: 0,
      left: 0
    };

    const logoStyle = {
      height: 40,
      margin: "auto",
      marginBottom: 40
    };

    const logoutStyle = {
      marginTop: this.props.user && !this.props.user.pin ? "25%" : "50%"
    };

    const forgotStyle = {
      fontSize: "12px",
      textDecoration: "underline",
      marginTop: 16
    };

    const resetStyle = {
      display: "block",
      width: "176px",
      margin: "0 auto"
    };

    const errorStyle = {
      color: alertColor
    };

    if (this.state.forgotPin)
      return (
        <V0MuiThemeProvider muiTheme={gMuiTheme}>
          <Paper zDepth={0} style={paperStyle}>
            <div className="loginForm pinForm">
              <div style={logoStyle}>
                <img
                  src="/betfluent-logo.png"
                  alt="Betfluent"
                  style={{ height: "40px" }}
                />
              </div>
              <TextField
                type="password"
                ref={password => {
                  this.password = password;
                }}
                floatingLabelText="Enter your Password"
                errorText={this.state.passwordError}
                errorStyle={errorStyle}
              />
              <RaisedButton
                style={resetStyle}
                primary
                onClick={this.removePin}
                label="Reset Pin"
              />
              <RaisedButton
                style={logoutStyle}
                secondary
                onClick={this.logout}
                label="Logout"
              />
            </div>
          </Paper>
        </V0MuiThemeProvider>
      );

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <Paper zDepth={0} style={paperStyle}>
          <div className="loginForm pinForm">
            <div style={logoStyle}>
              <img
                src="/betfluent-logo.png"
                alt="Betfluent"
                style={{ height: "40px" }}
              />
            </div>
            {this.renderPinScreen(this.props.user)}
            <RaisedButton
              style={logoutStyle}
              primary
              onClick={this.logout}
              label="Logout"
            />
            <div style={forgotStyle}>
              <Link
                to="#"
                style={{ color: themeColor }}
                onClick={this.forgotPin}
              >
                Forgot your PIN?
              </Link>
            </div>
          </div>
        </Paper>
      </V0MuiThemeProvider>
    );
  }
}
