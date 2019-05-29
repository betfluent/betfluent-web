// @flow
/* eslint-disable */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Lottie from "react-lottie";
import { Card } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from "material-ui/Snackbar";
import "../../../Styles/Withdraw.css";
import { gMuiTheme } from "../Styles";
import { getNewUid, getUserIdentity } from "../../Services/DbService";
import {
  WithdrawService,
  PaypalWithdrawService,
  CallbackService
} from "../../Services/BackendService";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import UserInfo from "../Portfolio/User";
import loadingDots from "../../../Assets/loadingDots.json";
import paypalLogo from "../../../Assets/paypalLogo.png";
import Address from "../Verify/Address";
import States from "../Verify/States";
import ReauthenticateModal from "../Shared/ReauthenticateModal";

const themeColor = gMuiTheme.palette.themeColor;
const textColor2 = gMuiTheme.palette.textColor2;
const alertColor = gMuiTheme.palette.alertColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

const loadingDotsOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingDots
};

const minWithdrawal = 20;

type WithdrawProps = {
  user: User,
  authUser: {
    email: string
  },
  history: {
    push: () => void,
    goBack: () => void
  },
  size: number,
  location: {},
  authenticateUser: () => void,
  isAuthenticated: boolean
};

export default class Withdraw extends Component<WithdrawProps> {
  constructor() {
    super();
    this.amountFocus = this.amountFocus.bind(this);
    this.amountChange = this.amountChange.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.paypalWithdraw = this.paypalWithdraw.bind(this);
    this.pinChange = this.pinChange.bind(this);
    this.receiveAddress = this.receiveAddress.bind(this);
    this.receiveStreet = this.receiveStreet.bind(this);
    this.onAddress2Change = this.onAddress2Change.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onZipChange = this.onZipChange.bind(this);
    this.finalizeTransaction = this.finalizeTransaction.bind(this);
    this.state = {
      amount: "",
      amountError: "",
      pin: "",
      pinError: "",
      disabled: false,
      barOpen: false,
      withdrawMethod: "check",
      withdrawByPaypal: false,
      withdrawAll: false,
      isAddressEdit: false,
      street: "",
      address2: "",
      city: "",
      state: null,
      zip: ""
    };
    window.finalizeTransaction = this.finalizeTransaction;
  }

  componentDidMount() {
    if (this.props.user) {
      this.addressPopulated = true;
      getUserIdentity(this.props.user.id).then(identity =>
        this.setState({
          street: identity.address1,
          address2: identity.address2,
          city: identity.addressCity,
          state: identity.addressState,
          zip: identity.addressPostalCode
        })
      );
      // if (this.props.user.balance < minWithdrawal * 100) {
      //   this.setState({ withdrawMethod: "check", withdrawAll: true });
      // }
    }
    this.renderTabContentContainer();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.inputPopulated && nextProps.user) {
      getUserIdentity(nextProps.user.id).then(identity => {
        const street = identity.address1;
        const address2 = identity.address2;
        const city = identity.addressCity;
        const state = identity.addressState;
        const zip = identity.addressPostalCode;
        this.setState({ street, address2, city, state, zip });
      });
      // if (nextProps.user.balance < minWithdrawal * 100) {
      //   this.setState({ withdrawMethod: "check", withdrawAll: true });
      // }
    }
  }

  componentDidUpdate() {
    this.renderTabContentContainer();
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

  finalizeTransaction() {
    const callbackRequest = {
      id: getNewUid(),
      result: {
        MerchantSessionID: this.sessionRequest.id,
        MerchantTransactionID: this.sessionRequest.request.transactionId
      }
    };

    CallbackService(callbackRequest).then(() => {
      window.setTimeout(() => {
        this.props.history.push("/");
      }, 5000);
    });
    window.finalizeTransaction = undefined;
  }

  requestSnackClose = () => {
    this.setState({ barOpen: false });
  };

  amountFocus(e) {
    if (
      e.target.value < minWithdrawal &&
      e.target.value * 100 === this.props.user.balance
    ) {
      e.target.blur();
    }
  }

  amountChange(e) {
    if (e.target.value * 100 > this.props.user.balance) {
      this.setState({ amountError: "Insufficient Funds!" });
    } else if (e.target.value < minWithdrawal) {
      this.setState({
        amountError: `Minimum withdrawal $${minWithdrawal} or full balance`
      });
    } else if (e.target.value <= 0) {
      this.setState({ amountError: "Please enter a valid amount" });
    } else {
      this.setState({ amountError: "" });
    }
    this.setState({ amount: e.target.value });
  }

  pinChange(e) {
    if (!e.target.value.match(/^\d\d\d\d$/)) {
      this.setState({ pinError: "Invalid PIN" });
    } else {
      this.setState({ pinError: "" });
    }
    this.setState({ pin: e.target.value });
  }

  receiveAddress(address) {
    const { street, city, state, zip } = address;
    this.setState({ street, city, state, zip });
  }

  receiveStreet(street) {
    this.setState({ street });
  }

  withdraw() {
    const WithdrawAmount = document.getElementById("WithdrawAmount").value;
    if (
      !this.state.amountError &&
      !this.state.pinError &&
      WithdrawAmount &&
      this.state.pin === this.props.user.pin
    ) {
      this.setState({ disabled: true });

      const orderId = getNewUid();
      const transactionId = `${orderId}_1`;

      const withdrawRequest = {
        id: getNewUid(),
        deviceLocation: this.props.location,
        serviceType: "WITHDRAW",
        request: {
          orderId,
          transactionId,
          pin: this.state.pin,
          amount: WithdrawAmount * 100,
          address1: this.state.street,
          address2: this.state.address2,
          addressCity: this.state.city,
          addressState: this.state.state,
          addressPostalCode: this.state.zip
        }
      };

      WithdrawService(withdrawRequest)
        .then(status => {
          if (status === "SUCCESS") {
            const amount = "";
            const pin = "";
            this.setState({ amount, pin, disabled: false, barOpen: true });
          }
        })
        .catch(withdrawError => {
          if (withdrawError === "PIN submitted does not match PIN on file.") {
            this.setState({ pinError: withdrawError });
          } else if (
            withdrawError === "Cannot withdraw more than available balance." ||
            withdrawError === "You are allowed only one withdrawal per week."
          ) {
            this.setState({
              amountError: withdrawError,
              disabled: false
            });
          }
        });
    } else if (!WithdrawAmount) {
      this.setState({ amountError: "Please enter an amount" });
    } else if (!this.state.pin) {
      this.setState({ pinError: "Please enter your pin" });
    } else if (this.state.pin !== this.props.user.pin) {
      this.setState({ pinError: "Incorrect pin" });
    }
  }

  paypalWithdraw() {
    const WithdrawAmount = document.getElementById("WithdrawAmount").value;
    if (
      !this.state.amountError &&
      !this.state.pinError &&
      WithdrawAmount &&
      this.state.pin === this.props.user.pin
    ) {
      const orderId = getNewUid();
      const transactionId = `${orderId}_1`;

      this.sessionRequest = {
        id: getNewUid(),
        serviceType: "WEBCASHIER",
        deviceLocation: this.props.location,
        request: {
          pin: this.state.pin,
          amount: WithdrawAmount * 100,
          payAction: "PAYOUT",
          orderId,
          transactionId
        }
      };
      this.setState({ disabled: true });
      PaypalWithdrawService(this.sessionRequest)
        .then(data => {
          const loadPaypal = () => {
            const src = data.src;
            if (src) {
              const iFrame = this.webCashier;
              const webcashierScript = document.createElement("script");
              webcashierScript.setAttribute("id", "webCashier");
              webcashierScript.setAttribute("src", src);
              const div = document.createElement("div");
              div.setAttribute("id", "GIDX_ServiceContainer");
              const script = document.createElement("script");
              script.setAttribute("src", "/WebCashier.js");
              if (iFrame) {
                iFrame.contentWindow.document.body.appendChild(div);
                iFrame.contentWindow.document.head.appendChild(script);
                iFrame.contentWindow.document.head.appendChild(
                  webcashierScript
                );
              }
            }
          };
          // Need to hold up the event loop by 100ms to ensure iframe loads.
          this.setState({ withdrawByPaypal: true }, () => {
            setTimeout(loadPaypal, 100);
          });
        })
        .catch(withdrawError => {
          if (withdrawError === "PIN submitted does not match PIN on file.") {
            this.setState({ pinError: withdrawError });
          } else if (
            withdrawError === "Cannot withdraw more than available balance." ||
            withdrawError === "You are allowed only one withdrawal per week."
          ) {
            this.setState({
              amountError: withdrawError,
              disabled: false
            });
          }
        });
    } else if (!WithdrawAmount) {
      this.setState({ amountError: "Please enter an amount" });
    } else if (!this.state.pin) {
      this.setState({ pinError: "Please enter your pin" });
    } else if (this.state.pin !== this.props.user.pin) {
      this.setState({ pinError: "Incorrect pin" });
    }
  }

  renderTabContentContainer() {
    if (this.withdrawContainer) {
      const withdrawContainer = this.withdrawContainer;
      const withdrawRect = withdrawContainer.getBoundingClientRect();
      withdrawContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - withdrawRect.top
          : window.innerHeight - withdrawRect.top - 56
      }px`;
    }
  }

  render() {
    if (!this.props.user) return null;

    const rootStyle = {
      width: "100%",
      maxWidth: 300,
      margin: "auto"
    };

    const errorStyle = {
      color: alertColor
    };

    const snackbarStyle = {
      width: "100vw",
      bottom: this.props.size < mobileBreakPoint ? 56 : 0
    };

    const snackbarBodyStyle = {
      maxWidth: "100vw",
      width: "100%",
      textAlign: "center",
      backgroundColor: themeColor,
      color: "#fff"
    };

    const radioButtonStyle = {
      width: "50%",
      marginTop: 12
    };

    const radioIconStyle = {
      width: 16
    };

    const radioLabelStyle = {
      textAlign: "left",
      fontSize: 14
    };

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
          {!this.state.withdrawByPaypal ? (
            <div>
              <div
                className="PortfolioHeader"
                style={{
                  boxShadow:
                    "0 3px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.08)"
                }}
              >
                <div className="contentHeader">
                  <UserInfo size={this.props.size} user={this.props.user} />
                </div>
              </div>
              <Divider style={{ marginTop: 0 }} />
              <div
                ref={withdrawContainer => {
                  this.withdrawContainer = withdrawContainer;
                }}
                style={{
                  padding: "24px 0 36px",
                  boxSizing: "border-box",
                  overflowY: "scroll"
                }}
              >
                <Card
                  zDepth={2}
                  className="tabContent withdrawCard"
                  style={{ paddingBottom: 24 }}
                >
                  <h2 style={{ margin: this.props.size < 340 ? 0 : 16 }}>
                    Withdraw
                  </h2>
                  <TextField
                    className="formInputStyle"
                    id="WithdrawAmount"
                    type="number"
                    value={
                      this.state.withdrawAll
                        ? this.props.user.balance / 100
                        : this.state.amount
                    }
                    onChange={this.amountChange}
                    onFocus={this.amountFocus}
                    floatingLabelText="Withdrawal Amount"
                    errorText={this.state.amountError}
                    errorStyle={errorStyle}
                    style={rootStyle}
                  />
                  <TextField
                    className="formInputStyle"
                    id="Pin"
                    type="password"
                    value={this.state.pin}
                    onChange={this.pinChange}
                    floatingLabelText="Enter your PIN"
                    errorText={this.state.pinError}
                    errorStyle={errorStyle}
                    style={rootStyle}
                  />
                  <div style={rootStyle}>
                    <RadioButtonGroup
                      name="withdrawMethod"
                      defaultSelected="check"
                      className="flexContainer"
                      onChange={event => {
                        this.setState({ withdrawMethod: event.target.value });
                      }}
                    >
                      {/* <RadioButton
                        value="paypal"
                        label={[
                          <img
                            key={0}
                            src={paypalLogo}
                            alt="PayPal"
                            style={{ width: "100%" }}
                          />
                        ]}
                        style={radioButtonStyle}
                        iconStyle={radioIconStyle}
                        labelStyle={radioLabelStyle}
                        disabled={this.state.withdrawAll}
                      /> */}
                      <RadioButton
                        value="check"
                        label="Check"
                        style={radioButtonStyle}
                        iconStyle={radioIconStyle}
                        labelStyle={radioLabelStyle}
                      />
                    </RadioButtonGroup>
                  </div>

                  {this.state.withdrawMethod === "check" ? (
                    <div
                      className="withdrawAddressContainer"
                      style={{ ...rootStyle, marginTop: 24 }}
                    >
                      <div className="flexContainer">
                        <h3>Send check to:</h3>
                        <span
                          role="presentation"
                          style={{ color: themeColor }}
                          onClick={() => this.setState({ isAddressEdit: true })}
                        >
                          Edit
                        </span>
                      </div>
                      {this.state.isAddressEdit ? null : (
                        <div>
                          <div>
                            {this.state.street} {this.state.address2},{" "}
                            {this.state.city}
                          </div>
                          <div>
                            {this.state.state} {this.state.zip}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {this.state.isAddressEdit &&
                  this.state.withdrawMethod === "check" ? (
                    <div className="withdrawAddressInput" style={rootStyle}>
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
                      <RaisedButton
                        style={{ margin: "24px auto 12px", width: 106 }}
                        primary
                        onClick={() => this.setState({ isAddressEdit: false })}
                        label="Save"
                      />
                    </div>
                  ) : (
                    <RaisedButton
                      style={{ margin: "24px auto 12px", width: 106 }}
                      secondary
                      disabled={this.state.disabled}
                      onClick={
                        this.state.withdrawMethod === "check" ||
                        this.state.withdrawAll
                          ? this.withdraw
                          : this.paypalWithdraw
                      }
                      label={
                        this.state.disabled ? (
                          <div className="lottieFile">
                            <Lottie options={loadingDotsOptions} />
                          </div>
                        ) : (
                          "WITHDRAW"
                        )
                      }
                    />
                  )}

                  <div className="withdrawRules" style={{ color: textColor2 }}>
                    <p>• The minimum withdrawal is ${minWithdrawal}</p>
                    <p>• Only one withdrawal per week is allowed</p>
                    {/*<p>
                      • Less than ${minWithdrawal}, must withdraw full balance
                      by check
                    </p>*/}
                  </div>
                </Card>
              </div>
              <Snackbar
                open={this.state.barOpen}
                message="Withdraw request successful"
                autoHideDuration={3000}
                onRequestClose={this.requestSnackClose}
                style={snackbarStyle}
                bodyStyle={snackbarBodyStyle}
              />
            </div>
          ) : (
            <iframe
              title="WebCashier"
              src="/DepositLoader.html"
              ref={el => {
                this.webCashier = el;
              }}
              width="100%"
              height={window.innerHeight}
              frameBorder={0}
            />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
