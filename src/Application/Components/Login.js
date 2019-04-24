// @flow
/* eslint-disable */

import React, { Component } from "react";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import VisibilityOn from "material-ui/svg-icons/action/visibility";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import { Link } from "react-router-dom";
import { gMuiTheme } from "./Styles";
import { signInWithEmail } from "../Services/AuthService";

const themeColor = gMuiTheme.palette.themeColor;
const textColor2 = gMuiTheme.palette.textColor2;
const alertColor = gMuiTheme.palette.alertColor;

export default class Login extends Component {
  constructor() {
    super();
    this.emailLogin = this.emailLogin.bind(this);
    this.pwFocused = this.pwFocused.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.state = {
      passwordError: false,
      passwordVisibility: false,
      isRemember: true
    };
  }

  checkEnter(e) {
    if (e.keyCode === 13) this.emailLogin();
  }

  emailLogin() {
    signInWithEmail(
      this.email.getValue(),
      this.password.getValue(),
      this.state.isRemember
    ).catch(error => {
      if (error.code === "auth/invalid-email") {
        this.setState({
          emailError: "Please enter a valid email address"
        });
      }

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        this.setState({
          passwordError: true
        });
      }
    });
  }

  pwFocused() {
    const icon = this.pwVisibility;
    icon.style.visibility = "visible";
  }

  showPassword() {
    let passwordVisibility = this.state.passwordVisibility;
    passwordVisibility = !passwordVisibility;
    this.setState({ passwordVisibility });
  }

  toggleRemember() {
    const oldRemember = this.state.isRemember;
    this.setState({ isRemember: !oldRemember });
  }

  renderPasswordError() {
    if (this.state.passwordError) {
      return "visible";
    }
    return "hidden";
  }

  render() {
    const paperStyle = {
      height: "100vh",
      overflowY: "scroll"
    };

    const logoStyle = {
      height: 40,
      margin: "auto",
      marginBottom: "24px"
    };

    const forgotStyle = {
      textAlign: "center",
      textDecoration: "underline",
      fontSize: 12,
      lineHeight: "24px"
    };

    const loginButtonStyle = {
      display: "inline-block",
      marginTop: 34,
      marginLeft: "10%",
      width: "45%"
    };

    const registerButtonStyle = {
      display: "inline-block",
      marginTop: 34,
      width: "45%"
    };

    const emailErrorStyle = {
      textAlign: "left",
      top: -5,
      color: alertColor
    };

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Paper zDepth={0} style={paperStyle}>
          <div className="loginForm">
            <div style={logoStyle}>
              <Link to="/">
                <img
                  src="/betfluent-logo.png"
                  alt="Betfluent"
                  style={{ height: "40px" }}
                />
              </Link>
            </div>
            <TextField
              id="email"
              fullWidth
              style={{ marginBottom: "10px" }}
              ref={email => {
                this.email = email;
              }}
              className="formInputStyle"
              floatingLabelText="Email"
              errorText={this.state.emailError}
              errorStyle={emailErrorStyle}
            />
            <TextField
              id="password"
              fullWidth
              ref={password => {
                this.password = password;
              }}
              type={this.state.passwordVisibility ? "text" : "password"}
              className="formInputStyle"
              floatingLabelText="Password"
              onFocus={this.pwFocused}
              onKeyDown={this.checkEnter}
            />
            <span
              role="presentation"
              className="pwVisibility"
              ref={pwVisibility => {
                this.pwVisibility = pwVisibility;
              }}
              style={{ visibility: "hidden" }}
              onClick={this.showPassword}
            >
              {this.state.passwordVisibility ? (
                <VisibilityOn />
              ) : (
                <VisibilityOff />
              )}
            </span>
            <div className="flexContainer">
              <Checkbox
                label="Remember me"
                checked={this.state.isRemember}
                onCheck={() => this.toggleRemember()}
                style={{ width: "50%" }}
                iconStyle={{ width: 18, marginLeft: -6, marginRight: 8 }}
                labelStyle={{
                  textAlign: "left",
                  fontSize: 14,
                  color: textColor2,
                  width: "100%"
                }}
              />
              <div style={forgotStyle}>
                <Link to="/forgotpassword" style={{ color: themeColor }}>
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Link to="/register">
              <RaisedButton
                style={registerButtonStyle}
                default
                label="REGISTER"
                labelColor={themeColor}
              />
            </Link>
            <RaisedButton
              style={loginButtonStyle}
              primary
              onClick={this.emailLogin}
              label="SIGN IN"
            />
            <div
              className="passwordError"
              style={{ visibility: this.renderPasswordError() }}
            >
              <p>Email Address & Password don&apos;t match.</p>
              <p>Please try again</p>
            </div>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}
