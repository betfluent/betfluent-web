// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "./Styles";
import { sendPasswordResetEmail } from "../Services/AuthService";

export default class Login extends Component {
  constructor() {
    super();
    this.sendPasswordReset = this.sendPasswordReset.bind(this);
    this.state = {
      emailSent: false
    };
  }

  sendPasswordReset() {
    sendPasswordResetEmail(this.email.getValue())
      .then(() => {
        const emailSent = true;
        this.setState({ emailSent });
      })
      .catch(error => {
        if (error) {
          this.setState({
            emailError: error.message
          });
        }
      });
  }

  render() {
    const themeColor = gMuiTheme.palette.themeColor;
    const alertColor = gMuiTheme.palette.alertColor;

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
      marginBottom: "40px"
    };

    const submitButtonStyle = {
      position: "relative",
      top: 15,
      margin: 24
    };

    const msgStyle = {
      fontSize: 14,
      lineHeight: "24px",
      fontWeight: 500,
      color: themeColor
    };

    const errorStyle = {
      color: alertColor
    };

    if (this.state.emailSent) {
      return (
        <MuiThemeProvider muiTheme={gMuiTheme}>
          <Paper zDepth={0} style={paperStyle}>
            <div className="loginForm">
              <div style={logoStyle}>
                <Link to="/login">
                  <img
                    src="/betfluent-logo.png"
                    alt="Betfluent"
                    style={{ height: "40px" }}
                  />
                </Link>
              </div>
              <div style={msgStyle}>
                An email has been sent to the provided email address for
                password recovery
              </div>
              <Link to="/">
                <RaisedButton primary label="OK" style={{ marginTop: 36 }} />
              </Link>
            </div>
          </Paper>
        </MuiThemeProvider>
      );
    }

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Paper zDepth={0} style={paperStyle}>
          <div className="loginForm">
            <div style={logoStyle}>
              <Link to="/login">
                <img
                  src="/betfluent-logo.png"
                  alt="Betfluent"
                  style={{ height: "40px" }}
                />
              </Link>
            </div>
            <TextField
              id="email"
              ref={email => {
                this.email = email;
              }}
              floatingLabelText="Email"
              errorText={this.state.emailError}
              errorStyle={errorStyle}
            />
            <RaisedButton
              style={submitButtonStyle}
              primary
              onClick={this.sendPasswordReset}
              label="Send Password Reset Email"
            />
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}
