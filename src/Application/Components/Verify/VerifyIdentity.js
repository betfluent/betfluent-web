// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import moment from "moment";
import Lock from "material-ui/svg-icons/action/lock-outline";
import { VerificationService } from "../../Services/BackendService";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import States from "./States";
import { appTheme, gMuiTheme } from "../Styles";
import { getNewUid, getUserIdentity } from "../../Services/DbService";
import Address from "./Address";
import VerifyDialog from "./VerifyDialog";
import ReauthenticateModal from "../Shared/ReauthenticateModal";
import CloseConsoleModal from "../Shared/CloseConsoleModal";
import CheckingLocationModal from "../Shared/CheckingLocationModal";
import RestrictedLocationModal from "../Shared/RestrictedLocationModal";
import * as fingerprint from "./fingerprint.json";

const themeColor = gMuiTheme.palette.themeColor;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type VerifyIdentityProps = {
  user: User,
  authUser: {
    email: string
  },
  history: {
    replace: () => void
  },
  location: {},
  size: number,
  approved: boolean,
  openConsole: boolean,
  authenticateUser: () => void,
  isAuthenticated: boolean
};

export default class VerifyIdentity extends Component<VerifyIdentityProps> {
  constructor() {
    super();
    this.identityVerify = this.identityVerify.bind(this);
    this.onFirstChange = this.onFirstChange.bind(this);
    this.onLastChange = this.onLastChange.bind(this);
    this.receiveStreet = this.receiveStreet.bind(this);
    this.onAddress2Change = this.onAddress2Change.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onZipChange = this.onZipChange.bind(this);
    this.receiveAddress = this.receiveAddress.bind(this);
    this.gotoDeposit = this.gotoDeposit.bind(this);
    this.gotoLobby = this.gotoLobby.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      user: null,
      error: {},
      first: "",
      last: "",
      date: "",
      street: "",
      address2: "",
      city: "",
      state: null,
      zip: "",
      ssn: "",
      checked: false,
      gambleIdLoading: false,
      identitySuccess: false,
      identityVerifiedOpen: false
    };
  }

  componentWillMount() {
    if (this.props.user && this.props.user.identityVerified) {
      this.props.history.replace("/account/deposit");
    } else if (this.props.user && !this.props.user.identityVerified) {
      this.inputPopulated = true;
      getUserIdentity(this.props.user.id).then(userIdentity => {
        const first = userIdentity.firstName;
        const last = userIdentity.lastName;
        const date = userIdentity.dateOfBirth;
        const street = userIdentity.address1;
        const address2 = userIdentity.address2;
        const city = userIdentity.addressCity;
        const state = userIdentity.addressState;
        const zip = userIdentity.addressPostalCode;
        this.setState({
          first,
          last,
          date,
          street,
          address2,
          city,
          state,
          zip
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.inputPopulated &&
      nextProps.user &&
      !nextProps.user.identityVerified
    ) {
      getUserIdentity(nextProps.user.id).then(userIdentity => {
        const first = userIdentity.firstName;
        const last = userIdentity.lastName;
        const date = userIdentity.dateOfBirth;
        const street = userIdentity.address1;
        const address2 = userIdentity.address2;
        const city = userIdentity.addressCity;
        const state = userIdentity.addressState;
        const zip = userIdentity.addressPostalCode;
        this.setState({
          first,
          last,
          date,
          street,
          address2,
          city,
          state,
          zip
        });
      });
    }
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

  onFirstChange(e) {
    this.setState({
      first: e.target.value
    });
  }

  onLastChange(e) {
    this.setState({
      last: e.target.value
    });
  }

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

  onSsnInput(input) {
    let ssn = this.state.ssn;
    if (input.keyCode === 8) {
      if (ssn.match(/^\d\d\d-\d\d-$/) || ssn.match(/^\d\d\d-$/)) {
        ssn = ssn.slice(0, -1);
      }
      this.setState({ ssn });
    }
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

  checkSsnInput(ssn) {
    let ssnNum = ssn;
    if (ssnNum.length > 10) {
      ssnNum = ssnNum.slice(0, 11);
    }
    const ssnValue = Number(ssnNum.replace(/[-]/g, ""));
    if (!Number.isInteger(ssnValue)) {
      ssnNum = ssnNum.slice(0, -1);
    }
    if (ssnNum.match(/^\d\d\d$/)) {
      ssnNum += "-";
    } else if (ssnNum.match(/^\d\d\d-\d\d$/)) {
      ssnNum += "-";
    }
    let ssnError = "You must enter a valid social security number";
    if (ssnNum.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
      ssnError = "";
    }
    this.setState({ ssn: ssnNum, ssnError });
  }

  checkDobInput(date) {
    let dobError = "";
    let dateNum = date;
    if (dateNum.length > 9) {
      dateNum = dateNum.slice(0, 10);
    }
    const dateValue = Number(date.replace(/[/]/g, ""));
    if (!Number.isInteger(dateValue)) {
      dateNum = dateNum.slice(0, -1);
    }
    if (dateNum.match(/^\d\d$/)) {
      dateNum += "/";
    } else if (dateNum.match(/^\d\d\/\d\d$/)) {
      dateNum += "/";
    }
    const validDate = moment(new Date(dateNum));
    /* eslint-disable-next-line */
    if (!validDate._isValid) {
      dobError = "Please enter a valid date";
    }
    this.setState({ date: dateNum, dobError });
  }

  identityVerify() {
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

    if (!this.state.date) {
      this.setState({ dobError: "You must enter a date of birth" });
      return null;
    }
    this.setState({ dobError: null });

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

    if (!this.state.first) {
      this.setState({ firstError: "You must enter a first name" });
      return null;
    }
    this.setState({ firstError: null });

    if (!this.state.last) {
      this.setState({ lastError: "You must enter a last name" });
      return null;
    }
    this.setState({ lastError: null });

    this.setState({ identityVerifiedOpen: true, gambleIdLoading: true });

    const payLoad = {
      dateCreated: new Date().getTime(),
      id: getNewUid(),
      request: {
        dateOfBirth: this.state.date,
        emailAddress: this.props.user.email,
        firstName: this.state.first,
        id: this.props.user.id,
        lastName: this.state.last,
        primary: true,
        userId: this.props.user.id,
        address1: this.state.street,
        address2: this.state.address2,
        addressCity: this.state.city,
        addressState: this.state.state,
        addressPostalCode: this.state.zip,
        ssn: this.state.ssn
      },
      serviceType: "ID_REGISTER",
      deviceLocation: this.props.location
    };

    VerificationService(payLoad).then(results => {
      if (results.includes("VERIFIED")) {
        const gambleIdLoading = false;
        const identitySuccess = true;
        const failed = false;
        this.setState({ gambleIdLoading, identitySuccess, failed });
      } else {
        const gambleIdLoading = false;
        const identitySuccess = false;
        const failed = true;
        this.setState({ gambleIdLoading, identitySuccess, failed });
      }
    });
    return null;
  }

  gotoLobby() {
    this.props.history.replace("/lobby");
  }

  gotoDeposit(amount) {
    this.props.history.replace(`/account/deposit#${amount}`);
  }

  receiveAddress(address) {
    const { street, city, state, zip } = address;
    this.setState({ street, city, state, zip });
  }

  receiveStreet(street) {
    this.setState({ street });
  }

  handleClose() {
    this.props.history.replace("/lobby");
  }

  closeIdentityDialog = () => {
    this.setState({ identityVerifiedOpen: false });
  };

  render() {
    const rootStyle = {
      width: "100%"
    };

    const DescStyle = {
      display: "block",
      color: textColor2,
      fontSize: 12,
      fontWeight: 500,
      marginTop: 0,
      textAlign: "left"
    };

    const buttonStyle = {
      position: "relative"
    };

    const errorStyle = {
      textAlign: "left",
      color: alertColor,
      top: -5
    };

    const verifyBackStyle = {
      backgroundColor: "#fff",
      overflowY: "scroll"
    };

    const verifyStyle = {
      margin: "0 auto"
    };

    const logoStyle = {
      height: 40,
      margin: "auto",
      marginTop: "32px",
      marginBottom: "32px"
    };

    const legalStyle = {
      textAlign: "left",
      margin: "20px 0",
      color: textColor3,
      fontSize: 12,
      lineHeight: "16px"
    };

    if (!this.props.user)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    if (!this.props.isAuthenticated) {
      return (
        <ReauthenticateModal
          size={this.props.size}
          open
          authUser={this.props.authUser}
          authenticateUser={this.props.authenticateUser}
        />
      );
    }

    if (this.props.openConsole) {
      return (
        <CloseConsoleModal
          size={this.props.size}
          open={this.props.openConsole}
        />
      );
    }

    if (
      !this.props.location ||
      this.props.approved === null ||
      this.props.approved === undefined
    ) {
      const startCheckingTime = new Date();
      this.startCheckingTime = startCheckingTime.getTime();
      ReactGA.modalview("locationModal");
      return <CheckingLocationModal size={this.props.size} open />;
    }

    if (
      this.props.location &&
      this.props.approved &&
      this.startCheckingTime !== null
    ) {
      const endCheckingTime = new Date();
      const checkingTime = endCheckingTime.getTime() - this.startCheckingTime;
      this.startCheckingTime = null;
      ReactGA.timing({
        category: "Checking Location",
        variable: "checking location",
        value: checkingTime,
        label: "Location Modal"
      });
    }

    if (this.props.approved === false) {
      const startRestrictedTime = new Date();
      this.startRestrictedTime = startRestrictedTime.getTime();
      ReactGA.modalview("restrictedLocationModal");
      return (
        <RestrictedLocationModal
          size={this.props.size}
          open
          handleClose={this.handleClose}
          behavior="verify"
        />
      );
    }

    if (this.props.approved && this.startRestrictedTime !== null) {
      const endRestrictedTime = new Date();
      const restrictedTime =
        endRestrictedTime.getTime() - this.startRestrictedTime;
      this.startRestrictedTime = null;
      ReactGA.timing({
        category: "Restricted Location",
        variable: "restricted location",
        value: restrictedTime,
        label: "Restricted Location Modal"
      });
    }

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {!this.props.user.identityVerified ? (
            <div style={verifyBackStyle}>
              {this.props.size < mobileBreakPoint ? (
                <MobileTopHeaderContainer />
              ) : null}
              <div style={verifyStyle} className="dialogContent">
                {this.props.size > mobileBreakPoint ? (
                  <div style={logoStyle}>
                    <img
                      alt="Betfluent Logo"
                      src="/bf-logo.png"
                      style={{ height: 40 }}
                    />
                  </div>
                ) : (
                  <div style={{ height: 24 }} />
                )}
                <div style={{ marginTop: 12 }}>
                  We couldn&#39;t verify your identity.
                </div>
                <div style={{ color: textColor2, marginBottom: 16 }}>
                  Please confirm the information below.
                </div>
                <TextField
                  id="first"
                  style={rootStyle}
                  value={this.state.first}
                  onChange={this.onFirstChange}
                  className="formInputStyle"
                  floatingLabelText="First Name"
                  errorText={this.state.firstError}
                  errorStyle={errorStyle}
                />
                <TextField
                  id="last"
                  style={rootStyle}
                  value={this.state.last}
                  onChange={this.onLastChange}
                  className="formInputStyle"
                  floatingLabelText="Last Name"
                  errorText={this.state.lastError}
                  errorStyle={errorStyle}
                />
                <TextField
                  id="dob"
                  style={rootStyle}
                  value={this.state.date}
                  hintText="MM/DD/YYYY"
                  className="formInputStyle"
                  floatingLabelText="Date of Birth"
                  onKeyDown={event => this.onDobInput(event)}
                  onInput={event => this.checkDobInput(event.target.value)}
                  errorText={this.state.dobError}
                  errorStyle={errorStyle}
                />
                <Address
                  defaultValue={this.state.street}
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

                <div style={{ position: "relative" }}>
                  <TextField
                    id="ssn"
                    style={rootStyle}
                    value={this.state.ssn}
                    onKeyDown={event => this.onSsnInput(event)}
                    onInput={event => this.checkSsnInput(event.target.value)}
                    className="formInputStyle"
                    floatingLabelText="Social Security Number (Optional)"
                    hintText="###-##-####"
                    errorText={this.state.ssnError}
                    errorStyle={errorStyle}
                  />
                  <div style={{ position: "absolute", right: 0, top: 36 }}>
                    <Lock style={{ fill: themeColor }} />
                  </div>
                  <p style={DescStyle}>
                    We’re serious about security and use cutting-edge technology
                    to ensure your personal information is fully encrypted.
                  </p>
                </div>

                <RaisedButton
                  primary
                  style={{ ...buttonStyle, marginTop: 12 }}
                  disabled={this.state.gambleIdLoading}
                  onClick={this.identityVerify}
                  label={this.state.gambleIdLoading ? "..." : "Verify Identity"}
                />
                <div style={legalStyle}>
                  <span>
                    By verifying, I agree to the{" "}
                    <Link
                      to="./termsofuse"
                      target="_blank"
                      style={{ color: themeColor }}
                    >
                      Terms of Use
                    </Link>{" "}
                    and the{" "}
                    <Link
                      to="./privacypolicy"
                      target="_blank"
                      style={{ color: themeColor }}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 50 }} />
            </div>
          ) : null}

          <VerifyDialog
            verifyDialogOpen={this.state.identityVerifiedOpen}
            handleClose={this.closeIdentityDialog}
            gotoDeposit={amount => {
              this.closeIdentityDialog();
              this.gotoDeposit(amount);
            }}
            gotoLobby={() => {
              this.closeIdentityDialog();
              this.gotoLobby();
            }}
            loading={this.state.gambleIdLoading}
            loadingTitle="Verifying your identity"
            loadingMsg="This may take a few moments."
            loadinglottieFile={fingerprint}
            success={this.state.identitySuccess}
            failMsg="We have been unable to verify your information, please double check the information and try again."
            failMsg2="Providing SSN is advised"
          />
        </div>
      </V0MuiThemeProvider>
    );
  }
}
