// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IntlProvider, FormattedNumber } from "react-intl";
import RaisedButton from "material-ui/RaisedButton";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import Build from "material-ui/svg-icons/image/edit";
import User from "../Models/User";

import { gMuiTheme } from "./Styles";
import { mgMuiTheme } from "./ManagerStyles";

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;

type MobileTopHeaderProps = {
  user: User,
  isManager: boolean,
  authUser: {},
  history: {
    push: () => void,
    location: {
      pathname: string
    }
  }
};

class MobileTopHeader extends Component<MobileTopHeaderProps> {
  constructor() {
    super();
    this.data = [];
    this.state = {
      drawerOpen: false
    };
  }

  componentWillMount() {
    if (this.props.user && this.props.user) {
      this.setData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setData(nextProps);
    }
  }

  setData(nextProps) {
    const data = [];
    if (nextProps.user) {
      data.push({ value: nextProps.user.balance / 100 });

      const returnKeys = nextProps.user.returns
        ? Object.keys(nextProps.user.returns)
        : [];
      const investments = nextProps.user.investments
        ? Object.keys(nextProps.user.investments).reduce((total, key) => {
            if (!returnKeys.includes(key))
              return total + Math.abs(nextProps.user.investments[key]);
            return total;
          }, 0)
        : 0;
      data.push({ value: investments / 100 });
    }
    this.data = data;
  }

  gotoDeposit = () => {
    this.props.history.push("/account/deposit");
  };

  showNavMenu = () => {
    const drawerOpen = true;
    this.setState({ drawerOpen });
  };

  render() {
    const activeStyle = {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      padding: "12px 0",
      paddingLeft: 56,
      marginBottom: 4,
      textAlign: "left",
      color: themeColor,
      borderRight: `3px solid ${themeColor}`
    };

    const activeIconStyle = {
      fill: themeColor,
      margin: 0
    };

    const inactiveStyle = {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      padding: "12px 0",
      paddingLeft: 56,
      marginBottom: 4,
      textAlign: "left",
      color: textColor3
    };

    const inactiveIconStyle = {
      fill: textColor3,
      margin: 0
    };

    const primaryTextStyle = {
      padding: "0 0 0 36px"
    };

    const dividerStyle = {
      marginBottom: 24
    };

    const balanceTitleStyle = {
      color: textColor3,
      fontSize: 12,
      lineHeight: "16px"
    };

    const balanceStyle = {
      color: textColor1,
      fontSize: 24,
      lineHeight: "32px",
      marginBottom: 16
    };

    const logoStyle = {
      margin: "20px auto",
      marginBottom: 16
    };

    const nameStyle = {
      color: this.props.isManager ? managerThemeColor : themeColor,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      marginBottom: 16
    };

    const iLocation = this.props.history.location.pathname;

    const renderUserData = () => {
      return (
        <div style={{ height: 236 }}>
          <div style={nameStyle}>{this.props.user && this.props.user.public.name}</div>
          <div style={balanceTitleStyle}>AVAILABLE BALANCE</div>
          <div style={balanceStyle}>
            <span style={{ position: "relative", bottom: 2 }}>
              <FormattedNumber
                style="currency"
                currency="USD"
                minimumFractionDigits={0}
                value={this.data.length && this.data[0].value}
              />
            </span>
          </div>
          <div style={balanceTitleStyle}>AMOUNT WAGERED</div>
          <div style={balanceStyle}>
            <span style={{ position: "relative", bottom: 2 }}>
              <FormattedNumber
                style="currency"
                currency="USD"
                minimumFractionDigits={0}
                value={this.data.length && this.data[1].value}
              />
            </span>
          </div>
          <RaisedButton
            style={{ width: 128 }}
            primary
            onClick={() => this.gotoDeposit()}
            label="Deposit"
            disabled={this.props.authUser && !this.props.authUser.emailVerified}
          />
        </div>
      );
    };

    return (
      <div>
        <AppBar
          title={
            <Link to="/">
              <img
                src="/betfluent-logo.png"
                alt="Betfluent"
                style={{ height: "36px" }}
              />
            </Link>
          }
          className="mobileBanner"
          style={{ backgroundColor: "white", position: "absolute" }}
          titleStyle={{ height: "36px", lineHeight: "36px", marginTop: "12px" }}
          onLeftIconButtonClick={this.showNavMenu}
        />
        <Drawer
          width={184}
          docked={false}
          open={this.state.drawerOpen}
          onRequestChange={drawerOpen => {
            this.setState({ drawerOpen });
          }}
        >
          <Link to="/">
            <img
              alt="Betfluent Logo"
              src={"/bf-logo.png"}
              height={48}
              style={logoStyle}
            />
          </Link>
          <IntlProvider locale="en">{renderUserData()}</IntlProvider>
          <Divider style={dividerStyle} />
          <MenuItem
            leftIcon={
              <Build
                style={
                  iLocation === "/manage" ? activeIconStyle : inactiveIconStyle
                }
              />
            }
            style={iLocation === "/manage" ? activeStyle : inactiveStyle}
            primaryText="Create"
            innerDivStyle={primaryTextStyle}
            containerElement={<Link to="/manage" />}
          />
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.authUser && state.authUser.authUser
});

export default connect(mapStateToProps)(MobileTopHeader);
