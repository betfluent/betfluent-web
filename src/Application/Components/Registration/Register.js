// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Checkbox from "material-ui/Checkbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import moment from "moment";
import VisibilityOn from "material-ui/svg-icons/action/visibility";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import { RegistrationService } from "../../Services/BackendService";
import { doesEmailExist } from "../../Services/AuthService";
import { gMuiTheme } from "../Styles";
import Address from "../Verify/Address";
import States from "../Verify/States";

const themeColor = gMuiTheme.palette.themeColor;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

export default class Register extends Component {
  constructor() {
    super();
    this.nextRegister = this.nextRegister.bind(this);
    this.emailRegister = this.emailRegister.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.onDobInput = this.onDobInput.bind(this);
    this.pwFocused = this.pwFocused.bind(this);
    this.receiveAddress = this.receiveAddress.bind(this);
    this.receiveStreet = this.receiveStreet.bind(this);
    this.onAddress2Change = this.onAddress2Change.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onZipChange = this.onZipChange.bind(this);
    this.state = {
      date: "",
      street: "",
      address2: "",
      city: "",
      state: null,
      zip: "",
      nextStep: false,
      agreeChecked: false
    };
  }

  onFirstChange() {
    const firstName = this.first.input.value;
    this.setState({ firstName });
  }

  onLastChange() {
    const lastName = this.last.input.value;
    this.setState({ lastName });
  }

  onDobInput(input) {
    let date = this.state.date;
    if (input.keyCode === 8) {
      if (date.match(/^\d\d\/\d\d\/$/) || date.match(/^\d\d\/$/)) {
        date = date.slice(0, -1);
      }
      this.setState({ date });
    }
  }

  onPasswordBlur() {
    const passwordInput = this.password.input.value;
    let passwordError = "";
    if (passwordInput.length < 6) {
      passwordError = "Password must be at least 6 characters";
    }
    this.setState({ passwordInput, passwordError });
  }

  onAgreeCheck = () => {
    const agreeChecked = !this.state.agreeChecked;
    this.setState({ agreeChecked });
  };

  onAddress2Change(e) {
    this.setState({
      address2: e.target.value
    });
  }

  onCityChange(e) {
    this.setState({
      city: e.target.value
    });
  }

  onStateChange(e) {
    this.setState({
      state: e
    });
  }

  onZipChange(e) {
    if (e.target.value.match(/^\d\d\d\d\d$/)) {
      this.setState({ zip: e.target.value, zipError: null });
    } else {
      this.setState({
        zip: e.target.value,
        zipError: "Must match pattern #####"
      });
    }
  }

  checkDobInput(date) {
    let dobError = "";
    /* eslint-disable no-param-reassign */
    if (date.length > 9) {
      date = date.slice(0, 10);
    }
    const dateValue = Number(date.replace(/[/]/g, ""));
    if (!Number.isInteger(dateValue)) {
      date = date.slice(0, -1);
    }
    if (date.match(/^\d\d$/)) {
      date += "/";
    } else if (date.match(/^\d\d\/\d\d$/)) {
      date += "/";
    }
    const validDate = moment(new Date(date));
    /* eslint-disable no-underscore-dangle */
    if (!validDate._isValid) {
      /* eslint-enable no-underscore-dangle */
      dobError = "Please enter a valid date";
    }
    this.setState({ date, dobError });
    /* eslint-disable no-param-reassign */
  }

  handleEmail() {
    const emailInput = this.email.input.value;
    let emailError = null;
    if (!/^\S+@\S+\.\S+$/.test(emailInput)) {
      emailError = "The email address is badly formatted.";
    }
    this.setState({ emailInput, emailError });
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

  receiveAddress(address) {
    const { street, city, state, zip } = address;
    this.setState({ street, city, state, zip });
  }

  receiveStreet(street) {
    this.setState({ street });
  }

  nextRegister() {
    if (!this.email.getValue()) {
      this.setState({ emailError: "Please enter an email" });
      return null;
    }
    this.setState({ emailError: null });

    if (!this.first.getValue()) {
      this.setState({ firstError: "You must enter a first name" });
      return null;
    }
    this.setState({ firstError: null });

    if (!this.last.getValue()) {
      this.setState({ lastError: "You must enter a last name" });
      return null;
    }
    this.setState({ lastError: null });

    if (!this.state.date) {
      this.setState({ dobError: "You must enter a date of birth" });
      return null;
    }
    this.setState({ dobError: null });

    const validDate = moment(new Date(this.state.date));
    /* eslint-disable no-underscore-dangle */
    if (!validDate._isValid) {
      /* eslint-enable no-underscore-dangle */
      this.setState({ dobError: "Please enter a valid date" });
      return null;
    }
    this.setState({ dobError: null });

    if (moment().diff(moment(new Date(this.state.date)), "years") < 21) {
      this.setState({ dobError: "You must be 21 years of age to register" });
      return null;
    }
    this.setState({ dobError: null });

    if (!this.password.getValue() || this.password.getValue().length < 6) {
      this.setState({
        passwordError: "Password must be at least 6 characters"
      });
      return null;
    }
    this.setState({ passwordError: null });

    doesEmailExist(this.email.getValue())
      .then(exists => {
        if (exists) {
          this.setState({
            emailError: "The email address is already in use by another account"
          });
        } else this.setState({ nextStep: true, emailError: null });
      })
      .catch(err => {
        this.setState({ emailError: err.message });
      });
    return null;
  }

  emailRegister() {
    if (this.state.ssnError || this.state.zipError) {
      return null;
    }

    if (!this.state.zip) {
      this.setState({ zipError: "You must enter a zip code" });
      return null;
    }
    this.setState({ zipError: null });

    if (!this.state.state) {
      this.setState({ stateError: "You must select your state" });
      return null;
    }
    this.setState({ stateError: null });

    if (!this.state.city) {
      this.setState({ cityError: "You must enter a city" });
      return null;
    }
    this.setState({ cityError: null });

    if (!this.state.street) {
      this.setState({ addressError: "You must enter an address" });
      return null;
    }
    this.setState({ addressError: null });

    RegistrationService(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.firstName,
      this.state.lastName,
      this.state.date,
      this.state.street,
      this.state.address2,
      this.state.city,
      this.state.state,
      this.state.zip
    ).catch(error => {
      if (error.code.indexOf("email") !== -1) {
        const emailError = error.message;
        this.setState({ emailError });
      } else if (error.code.indexOf("pass") !== -1) {
        const passwordError = error.message;
        this.setState({ passwordError });
      }
    });
    return null;
  }

  render() {
    const paperStyle = {
      height: "100vh",
      overflowY: "scroll"
    };

    const logoStyle = {
      height: 40,
      margin: "0 auto",
      marginTop: "32px",
      marginBottom: "20px"
    };

    const errorStyle = {
      textAlign: "left",
      color: alertColor,
      top: -5
    };

    const rootStyle = {
      width: "100%"
    };

    const registrationStyle = {
      overflowX: "hidden",
      display: "block",
      margin: "0 auto"
    };

    const hybridStyle = {
      fontSize: "20px",
      marginBottom: 15,
      fontWeight: 500
    };

    const descStyle = {
      fontSize: "14px",
      textAlign: "left"
    };

    const legalStyle = {
      fontSize: 14,
      color: textColor2,
      textAlign: "left",
      marginTop: 4
    };

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Paper zDepth={0} style={paperStyle}>
          <div style={registrationStyle} className="dialogContent">
            <div style={logoStyle}>
              <Link to="/">
                <img
                  src="/betfluent-logo.png"
                  alt="Betfluent"
                  style={{ height: "40px" }}
                />
              </Link>
            </div>
            <div>
              <div style={hybridStyle}>Online Sports Betting</div>
              <div style={descStyle} />
            </div>

            {!this.state.nextStep ? (
              <div>
                <TextField
                  id="email"
                  fullWidth
                  ref={email => {
                    this.email = email;
                  }}
                  onBlur={() => {
                    this.handleEmail();
                  }}
                  onFocus={() => {
                    this.setState({ emailError: null });
                  }}
                  type="email"
                  className="formInputStyle"
                  floatingLabelText="Email"
                  errorText={this.state.emailError}
                  errorStyle={errorStyle}
                />
                <TextField
                  id="first"
                  fullWidth
                  ref={first => {
                    this.first = first;
                  }}
                  onChange={() => {
                    this.onFirstChange();
                  }}
                  className="formInputStyle"
                  floatingLabelText="First Name"
                  errorText={this.state.firstError}
                  errorStyle={errorStyle}
                />
                <TextField
                  id="last"
                  fullWidth
                  ref={last => {
                    this.last = last;
                  }}
                  onChange={() => {
                    this.onLastChange();
                  }}
                  className="formInputStyle"
                  floatingLabelText="Last Name"
                  errorText={this.state.lastError}
                  errorStyle={errorStyle}
                />
                <TextField
                  id="dob"
                  fullWidth
                  value={this.state.date}
                  hintText="MM/DD/YYYY"
                  className="formInputStyle"
                  floatingLabelText="Date of Birth"
                  onKeyDown={event => this.onDobInput(event)}
                  onInput={event => this.checkDobInput(event.target.value)}
                  errorText={this.state.dobError}
                  errorStyle={errorStyle}
                />
                <div style={{ position: "relative" }}>
                  <TextField
                    id="password"
                    fullWidth
                    ref={password => {
                      this.password = password;
                    }}
                    type={this.state.passwordVisibility ? "text" : "password"}
                    className="formInputStyle"
                    floatingLabelText="Password"
                    errorText={this.state.passwordError}
                    onBlur={event => this.onPasswordBlur(event)}
                    onFocus={() => {
                      this.pwFocused();
                      this.setState({ passwordError: null });
                    }}
                    errorStyle={errorStyle}
                  />
                  <span
                    className="pwVisibility"
                    role="presentation"
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
                </div>
                <RaisedButton
                  className="login-submit"
                  primary
                  onClick={this.nextRegister}
                  label="Next"
                  style={{ marginTop: 24 }}
                />
              </div>
            ) : (
              <div>
                <Address
                  receiveStreet={this.receiveStreet}
                  receiveAddress={this.receiveAddress}
                  errorText={this.state.addressError}
                />
                <TextField
                  id="address2"
                  style={rootStyle}
                  value={this.state.address2}
                  onChange={this.onAddress2Change}
                  className="formInputStyle"
                  floatingLabelText="Address Line 2"
                />
                <TextField
                  id="city"
                  style={rootStyle}
                  value={this.state.city}
                  onChange={this.onCityChange}
                  className="formInputStyle"
                  floatingLabelText="City"
                  errorText={this.state.cityError}
                  errorStyle={errorStyle}
                />
                <States
                  value={this.state.state}
                  onStateChange={this.onStateChange}
                  errorText={this.state.stateError}
                />
                <TextField
                  id="zip"
                  style={rootStyle}
                  value={this.state.zip}
                  onChange={this.onZipChange}
                  className="formInputStyle"
                  floatingLabelText="Zip Code"
                  errorText={this.state.zipError}
                  errorStyle={errorStyle}
                />

                <div
                  className="flexContainer"
                  style={{ flexWrap: "noWrap", marginTop: 12 }}
                >
                  <Checkbox
                    style={{ width: 24 }}
                    iconStyle={{ width: 18, marginLeft: -4, marginRight: 8 }}
                    onCheck={this.onAgreeCheck}
                  />
                  <span style={legalStyle}>
                    By registering, I agree to the{" "}
                    <Link
                      to="./termsofuse"
                      target="_blank"
                      style={{ color: themeColor }}
                    >
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="./privacypolicy"
                      target="_blank"
                      style={{ color: themeColor }}
                    >
                      Privacy Policy
                    </Link>{" "}
                    and confirm that I am at least 21 years of age.
                  </span>
                </div>
                <RaisedButton
                  className="login-submit"
                  primary
                  onClick={this.emailRegister}
                  label="Register"
                  disabled={!this.state.agreeChecked}
                  style={{ marginTop: 24 }}
                />
              </div>
            )}

            <div style={{ margin: "36px auto" }}>
              <span style={{ color: textColor3, fontSize: 14 }}>
                Already have an account?{" "}
              </span>
              <Link to="/">
                <FlatButton primary label="Sign In" />
              </Link>
            </div>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}
