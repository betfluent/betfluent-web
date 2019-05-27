// @flow
/* eslint-disable */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { IntlProvider, FormattedNumber } from "react-intl";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { Card } from "material-ui/Card";
import Divider from "material-ui/Divider";
import ArrowRight from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import ArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import Edit from "material-ui/svg-icons/image/edit";
import Toggle from "material-ui/Toggle";
import { appTheme, gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import User from "../../Models/User";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import UserInfo from "../Portfolio/User";
import { signOut } from "../../Services/AuthService";
import { setPreferences } from "../../Services/DbService";
import Avatar from "../Avatar";
import EditSummaryDialog from "./EditSummaryDialog";
import EditUserProfileDialog from "./EditUserProfileDialog";

type AccountProps = {
  user: User,
  authUser: {
    emailVerified: boolean
  },
  isManager: boolean,
  size: number
};

type AccountState = {
  lock: boolean
};

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

export default class Account extends Component<AccountProps, AccountState> {
  constructor() {
    super();
    this.switchNotification = this.switchNotification.bind(this);
    this.logout = this.logout.bind(this);
    this.renderHeight = this.renderHeight.bind(this);
    this.state = {
      lock: false,
      isDialogOpen: false,
      editSportsPreference: false,
      display: "none"
    };
  }

  setLock(lock) {
    this.setState({ lock });
  }

  setEdit() {
    let editSportsPreference = this.state.editSportsPreference;
    let display;
    editSportsPreference = !editSportsPreference;
    if (editSportsPreference) {
      display = "block";
    } else {
      display = "none";
    }
    this.setState({ editSportsPreference, display, isDialogOpen: false });
  }

  logout = () => {
    signOut().then(() => {
      this.setLock(true);
    });
  };

  switchNotification(option) {
    const preferences = this.props.user.preferences;
    preferences[option] = !preferences[option];
    setPreferences(this.props.user, preferences);
  }

  finishEdit = () => {
    this.setState({ editSportsPreference: false, display: "none" });
  };

  renderHeight() {
    if (this.props.size < mobileBreakPoint) {
      if (
        this.props.user.documentStatus === "RETRY" ||
        this.props.user.documentStatus === "FAIL"
      ) {
        return window.innerHeight - 324;
      }
      return window.innerHeight - 276;
    }
    if (
      this.props.user.documentStatus === "RETRY" ||
      this.props.user.documentStatus === "FAIL"
    ) {
      return window.innerHeight - 208;
    }
    return window.innerHeight - 160;
  }

  render() {
    if (!this.props.user || !this.props.authUser)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    const user = this.props.user;
    const authUser = this.props.authUser;

    const titleStyle = {
      fontSize: 20,
      lineHeight: "28px",
      color: textColor1,
      fontWeight: 500
    };

    const arrowStyle = {
      color: themeColor,
      position: "absolute",
      top: 24,
      right: 4
    };

    const headerTitleStyle = {
      fontSize: 20,
      lineHeight: "28px",
      color: textColor1,
      fontWeight: 500
    };

    const headerSubtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor2,
      fontWeight: 400
    };

    const subtitleStyle = {
      color: textColor3,
      fontSize: 12,
      lineHeight: "14px",
      paddingBottom: 16
    };

    const toggleLabelStyle = {
      color: textColor1
    };

    const toggleThumbStyle = {
      width: 14,
      height: 14,
      top: 2
    };

    const toggleTrackStyle = {
      height: 10
    };

    const toggleIconStyle = {
      width: 24,
      right: -10,
      top: 12
    };

    const editIconContainerStyle = {
      fontSize: 12,
      fontWeight: 500,
      position: "absolute",
      right: 0,
      top: 4,
      cursor: "pointer"
    };

    const editIconStyle = {
      width: 16,
      height: 16,
      marginBottom: -4,
      marginLeft: 4
    };

    const returnKeys = this.props.user.returns
      ? Object.keys(this.props.user.returns)
      : [];

    const investments = this.props.user.investments
      ? Object.keys(this.props.user.investments).reduce((total, key) => {
          if (!returnKeys.includes(key))
            return total + Math.abs(this.props.user.investments[key]);
          return total;
        }, 0)
      : 0;

    const renderApprovedDeposit = () => {
      if (authUser.emailVerified) {
        return (
          <Link to="/account/deposit">
            <div style={{ color: themeColor }}>
              Deposit
              <ArrowRight style={arrowStyle} />
              <div style={subtitleStyle}>Deposit money to wager in pools</div>
              <Divider />
            </div>
          </Link>
        );
      }

      return (
        <div style={{ color: textColor3 }} className="accountOption">
          Deposit
          <ArrowRight style={{ ...arrowStyle, color: textColor3 }} />
          <div style={subtitleStyle}>Email verification required</div>
        </div>
      );
    };

    const renderApprovedWithdraw = () => {
      if (user.balance === 0) {
        return (
          <div style={{ color: textColor3 }} className="accountOption">
            Withdraw
            <ArrowRight style={{ ...arrowStyle, color: textColor3 }} />
            <div style={subtitleStyle}>$0 in your available balance</div>
          </div>
        );
      }

      if (user.documentStatus === "VERIFIED") {
        return (
          <Link to="/account/withdraw">
            <div style={{ color: textColor1 }}>
              Withdraw
              <ArrowRight style={arrowStyle} />
              <div style={subtitleStyle}>Withdraw from available balance</div>
            </div>
          </Link>
        );
      }

      return (
        <Link to="/account/verify-document">
          <div style={{ color: textColor1 }} className="accountOption">
            Withdraw
            <ArrowRight style={{ ...arrowStyle, color: textColor3 }} />
            <div style={subtitleStyle}>Photo ID verification required</div>
          </div>
        </Link>
      );
    };

    const renderManagerInfo = () => {
      return (
        <V0MuiThemeProvider muiTheme={mgMuiTheme}>
            <React.Fragment>
              <Avatar
                width={80}
                userName={user.name}
                userAvatar={user.manager.avatarUrl}
                key={user.manager.avatarUrl}
                isManager
                allowUpload
              />
              <div
                className="flexVertical"
                style={{ justifyContent: "space-between", flex: 1 }}
              >
                <div style={{ paddingRight: 48 }}>
                  <div style={headerTitleStyle}>
                    {user.manager.name || null}
                  </div>
                  <div style={headerSubtitleStyle}>{user.name || null}</div>
                  <div style={headerSubtitleStyle}>
                    {user.manager.company || null}
                  </div>
                  <div
                    style={{
                      ...headerSubtitleStyle,
                      fontSize: 14,
                      fontWeight: 500,
                      marginTop: 8
                    }}
                  >
                    <span style={{ color: managerThemeColor }}>
                      {user.manager.details.specialty || null}
                    </span>{" "}
                    Specialist
                  </div>
                </div>
                <div
                  style={{
                    ...headerSubtitleStyle,
                    fontSize: 14,
                    marginBottom: 8,
                    marginTop: 8
                  }}
                >
                  {user.manager.details.summary
                    ? user.manager.details.summary
                    : "Your profile is empty! Write something to let players know more about you."}
                </div>
                <div style={titleStyle}>
                  <IntlProvider locale="en">
                    <React.Fragment>
                      <span style={{ color: textColor2 }}>
                      <FormattedNumber
                        style="currency"
                        currency="USD"
                        minimumFractionDigits={2}
                        value={this.props.user.balance / 100}
                      />{" "}
                        {"\u00B7"}{" "}
                      </span>
                      <span style={{ color: themeColor }}>
                        <FormattedNumber
                          style="currency"
                          currency="USD"
                          minimumFractionDigits={2}
                          value={investments / 100}
                        />
                      </span>
                    </React.Fragment>
                  </IntlProvider>
                </div>
                <div style={subtitleStyle}>
                  <span>Available {"\u00B7"} </span>
                  <span style={{ color: themeColor }}>Wagered</span>
                </div>
              </div>
              <div
                role="presentation"
                onClick={() => {
                  this.setState({ isDialogOpen: true });
                }}
                style={{
                  ...editIconContainerStyle,
                  color: managerThemeColor
                }}
              >
                EDIT
                <Edit
                  style={{
                    ...editIconStyle,
                    fill: managerThemeColor
                  }}
                />
              </div>
              <EditSummaryDialog
                managerId={user.manager.id}
                isDialogOpen={this.state.isDialogOpen}
                summary={user.manager.details.summary}
                handleClose={() => {
                  this.setState({ isDialogOpen: false });
                }}
              />
          </React.Fragment>
        </V0MuiThemeProvider>
      );
    }

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}   
          <div className="AccountHeader">
            <div className="contentHeader flexContainer">
              {this.props.isManager
                ? renderManagerInfo()
                : <UserInfo user={user} showRealName allowUpload />}
            </div>
          </div>
          <div
            style={{
              maxHeight: this.renderHeight(),
              overflowY: "scroll"
            }}
          >
            <div className="AccountCard contentHeader">
              <div className="userStatus">
                <h2>Banking</h2>
                <Card
                  className="accountOptions"
                  zDepth={authUser.emailVerified ? 2 : 0}
                >
                  {renderApprovedDeposit()}
                  {renderApprovedWithdraw()}
                </Card>
              </div>
            </div>

            <div className="AccountCard contentHeader">
              <h2>Personalize</h2>
              <Card className="accountOptions" zDepth={2}>
                <div
                  className="accountOption editUsername"
                  role="presentation"
                  onClick={() => {
                    this.setState({ isDialogOpen: true });
                  }}
                >
                  <div style={{ color: textColor1 }}>
                    Username
                    <ArrowRight style={arrowStyle} />
                    <div style={subtitleStyle}>
                      Customize how others see you
                    </div>
                    <Divider />
                  </div>
                </div>
                <EditUserProfileDialog
                  managerId={user.manager && user.manager.id || ""}
                  publicUserId={user.publicId}
                  isDialogOpen={this.state.isDialogOpen}
                  publicName={user.public.name}
                  handleClose={() => {
                    this.setState({ isDialogOpen: false });
                  }}
                />
              </Card>
            </div>

            <div className="AccountCard contentHeader">
              <h2>Notifications</h2>
              <Card className="accountOptions" zDepth={2}>
                <div className="accountOption">
                  <Toggle
                    label="Bet Emails"
                    toggled={user.preferences.receiveBetEmail}
                    onClick={() => this.switchNotification("receiveBetEmail")}
                    labelStyle={toggleLabelStyle}
                    thumbStyle={toggleThumbStyle}
                    trackStyle={toggleTrackStyle}
                    iconStyle={toggleIconStyle}
                  />
                  <div style={subtitleStyle}>
                    E-mail notification about Bets
                  </div>
                  <Divider />
                </div>
                <div className="accountOption">
                  <Toggle
                    label="Return Emails"
                    toggled={user.preferences.receiveReturnEmail}
                    onClick={() =>
                      this.switchNotification("receiveReturnEmail")
                    }
                    labelStyle={toggleLabelStyle}
                    thumbStyle={toggleThumbStyle}
                    trackStyle={toggleTrackStyle}
                    iconStyle={toggleIconStyle}
                  />
                  <div style={subtitleStyle}>
                    E-mail notification about Pool Returns
                  </div>
                </div>
              </Card>
            </div>

            <button
              className="logoutBtn"
              style={{ color: gMuiTheme.palette.themeColor, marginBottom: 56 }}
              onClick={this.logout}
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
