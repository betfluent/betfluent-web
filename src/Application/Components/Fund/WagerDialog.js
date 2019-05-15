// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import DomConfetti from "react-dom-confetti";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { FormattedNumber } from "react-intl";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import Lottie from "react-lottie";
import CheckMark from "material-ui/svg-icons/navigation/check";
import { getNewUid } from "../../Services/DbService";
import { WagerService } from "../../Services/BackendService";
import { gMuiTheme, mobileBreakPoint } from "../Styles";
import loadingDots from "../../../Assets/loadingDots.json";
import ReauthenticateModal from "../Shared/ReauthenticateModal";
import CloseConsoleModal from "../Shared/CloseConsoleModal";
import CheckingLocationModal from "../Shared/CheckingLocationModal";
import RestrictedLocationModal from "../Shared/RestrictedLocationModal";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const themeColor = gMuiTheme.palette.themeColor;

const loadingDotsOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingDots
};

type WagerDialogProps = {
  open: boolean,
  user: User,
  authUser: {
    email: string
  },
  endWagering: () => void,
  fund: Fund,
  approved: boolean,
  location: {},
  openConsole: boolean,
  authenticateUser: () => void,
  isAuthenticated: boolean,
  size: number
};

export default class WagerDialog extends Component<WagerDialogProps> {
  constructor(props) {
    super(props);
    this.startCheckingTime = null;
    this.startRestrictedTime = null;
    this.handleClose = this.handleClose.bind(this);
    this.onWagerChange = this.onWagerChange.bind(this);
    this.onPlaceWager = this.onPlaceWager.bind(this);
    this.state = {
      lock: false,
      open: props.open,
      wagerConfirmed: null,
      disabled: true,
      displayAmount: "",
      passwordVisibility: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  onWagerChange(e) {
    const rawAmount = Number(e.target.value.slice(0, 9));
    let amount;
    let displayAmount;
    let disabled = true;
    let wagerError = null;

    if (Number.isInteger(rawAmount)) {
      amount = rawAmount * 100;
      if (amount > 0) {
        displayAmount = rawAmount;
      } else {
        displayAmount = "";
      }
      if (amount > this.props.user.balance) {
        wagerError = "You cannot wager more than your available balance";
      }
      if (amount < this.props.fund.minInvestment) {
        wagerError = "You must wager more than the minimum wager";
      }
      if (amount > this.props.fund.maxInvestment) {
        wagerError = "You cannot wager more than the maximum wager";
      }
      if (amount && !wagerError) {
        disabled = false;
      }
    } else {
      wagerError = "Please enter a valid number";
      displayAmount = this.state.displayAmount;
    }
    this.setState({ amount, disabled, wagerError, displayAmount });
  }

  onPlaceWager() {
    if (this.state.wagerConfirmed) {
      this.handleClose();
      return null;
    }

    this.setState({ disabled: true, wagerConfirmed: false });

    const wagerRequest = {
      id: getNewUid(),
      serviceType: "WAGER",
      deviceLocation: this.props.location,
      request: {
        fundId: this.props.fund.id,
        amount: this.state.amount
      }
    };

    WagerService(wagerRequest)
      .then(message => {
        if (message === "SUCCESS") {
          ReactGA.event({
            category: "Wager",
            action: "Placed a wager"
          });
          const wagerConfirmed = true;
          const disabled = false;
          this.setState({ wagerConfirmed, disabled });
          window.setTimeout(() => {
            this.handleClose();
          }, 3500);
        }
      })
      .catch(wagerError => {
        const disabled = false;
        const wagerConfirmed = null;
        this.setState({ wagerError, disabled, wagerConfirmed });
      });
    return null;
  }

  handleClose() {
    const open = false;
    const amount = null;
    const wagerConfirmed = null;
    const wagerError = null;
    const displayAmount = "";
    this.setState({ open, amount, displayAmount, wagerConfirmed, wagerError });
    this.props.endWagering();
  }

  render() {
    const wagerTitleStyle = {
      textAlign: "center",
      color: themeColor
    };

    const subTitleStyle = {
      color: textColor1,
      width: 215,
      fontSize: "12px",
      fontWeight: 400,
      margin: "0 auto",
      textAlign: "center"
    }

    const avatarWrapperStyle = {
      margin: "16px auto",
      textAlign: "center"
    }

    const avatarStyle = {
      width: 136,
      height: 136,
      borderRadius: 68
    }

    const buttonContainerStyle = {
      position: "absolute",
      bottom: 15,
      left: "50%",
      transform: "translateX(-50%)",
      width: "200px",
      textAlign: "center"
    };

    const buttonStyle = {
      position: "relative",
      display: "block"
    };

    const balanceTitleStyle = {
      color: textColor3,
      fontSize: "14px"
    };

    const balanceStyle = {
      color: "black",
      fontSize: "24px",
      lineHeight: "36px",
      marginBottom: "25px"
    };

    const usdStyle = {
      position: "absolute",
      top: 12,
      left: 60,
      fontSize: 24,
      color: textColor1
    };

    const hintStyle = {
      position: "absolute",
      textAlign: "center",
      width: "100%",
      fontSize: "24px"
    };

    const textBoxStyle = {
      textAlign: "center",
      fontSize: 24
    };

    const infoStyle = {
      fontSize: "14px",
      color: textColor3,
      fontWeight: 200,
      margin: "20px 0"
    };

    const modalStyle = {
      width: this.props.size > 340 ? 350 : 310,
      transform: this.props.size > 375 ? "translate(0, 64px)" : "translate(0, 32px)"
    };

    const checkStyle = {
      fill: "#fff",
      verticalAlign: "middle"
    };

    const errorStyle = {
      color: alertColor
    };

    const confettiConfig = {
      angle: 90,
      spread: 45,
      startVelocity: 35,
      elementCount: 150,
      decay: 0.95
    };

    const renderActionLabel = () => {
      if (this.state.wagerConfirmed) return <CheckMark style={checkStyle} />;
      if (this.state.wagerConfirmed === false) {
        return (
          <div className="lottieFile">
            <Lottie options={loadingDotsOptions} />
          </div>
        );
      }
      return "BET WITH";
    };

    const actions = [
      <RaisedButton
        key={0}
        label={renderActionLabel()}
        style={buttonStyle}
        disabled={this.state.disabled}
        primary
        fullWidth
        onClick={this.onPlaceWager}
      />,
      <FlatButton
        key={1}
        label="CANCEL"
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.handleClose}
      />
    ];

    const SubTitle = props => (
      <span>
        {[
          "$",
          props.fund.minInvestment / 100,
          " Min / ",
          <FormattedNumber
            key={0}
            style="currency"
            currency="USD"
            minimumFractionDigits={0}
            value={props.fund.maxInvestment / 100}
          />,
          " Max \u00B7 ",
          props.fund.percentFee,
          "% Fee"
        ]}
      </span>
    );

    if (!this.props.isAuthenticated) {
      return (
        <ReauthenticateModal
          size={this.props.size}
          open={this.state.open}
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
      if (this.state.open) {
        const startCheckingTime = new Date();
        this.startCheckingTime = startCheckingTime.getTime();
        ReactGA.modalview("locationModal");
      }
      return (
        <CheckingLocationModal size={this.props.size} open={this.state.open} />
      );
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
      if (this.state.open) {
        const startRestrictedTime = new Date();
        this.startRestrictedTime = startRestrictedTime.getTime();
        ReactGA.modalview("restrictedLocationModal");
      }
      return (
        <RestrictedLocationModal
          size={this.props.size}
          open={this.state.open}
          handleClose={this.handleClose}
          behavior="wager"
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

    console.log(this.props.size)

    return (
      <Dialog
        title="Bet With"
        titleStyle={wagerTitleStyle}
        actions={actions}
        actionsContainerStyle={buttonContainerStyle}
        modal
        open={this.state.open}
        onRequestClose={this.handleClose}
        bodyStyle={{ minHeight: 270, overflowX: "hidden", overflowY: "scroll" }}
        contentStyle={modalStyle}
        paperProps={{ style: { minHeight: this.props.size > 375 ? 610 : 575 } }}
        style={{ overflowY: "scroll" }}
      >
        <div style={subTitleStyle}>
            You are choosing to ride with {this.props.fund.manager.name}, 
            You will be notified of the bet details 
            10 minutes before the game starts.
        </div>
        <div style={avatarWrapperStyle}>
          <img style={avatarStyle} src={this.props.fund.manager.avatarUrl} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={balanceTitleStyle}>AVAILABLE BALANCE</div>
          <div style={balanceStyle}>
            <FormattedNumber
              style="currency"
              currency="USD"
              minimumFractionDigits={2}
              value={this.props.user.balance / 100}
            />
          </div>
          <div style={balanceTitleStyle}>AMOUNT TO WAGER</div>
          <div style={{ position: "relative" }}>
            <div style={usdStyle}>$</div>
            <TextField
              style={{ width: 150 }}
              hintStyle={hintStyle}
              inputStyle={textBoxStyle}
              className="wagerText"
              hintText="0"
              type="number"
              onChange={this.onWagerChange}
              value={this.state.displayAmount}
              errorText={this.state.wagerError}
              errorStyle={errorStyle}
            />
            <div style={infoStyle}>
              <SubTitle fund={this.props.fund} />
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: textColor3,
              position: "absolute",
              bottom: 104,
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px"
            }}
          >
            <div className="wagerConfetti">
              <DomConfetti
                active={this.state.wagerConfirmed}
                config={confettiConfig}
              />
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
