// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component, Header } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IntlProvider, FormattedNumber } from "react-intl";
import RaisedButton from "material-ui/RaisedButton";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";
import Drawer from "material-ui/Drawer";
import Build from "material-ui/svg-icons/image/edit";
import User from "../Models/User";

import * as topBarShape from "../../Assets/topBarShape.png";
import * as signInButton from "../../Assets/signin-button.png";
import * as registerButton from "../../Assets/register-button.png";
import * as learnButton from "../../Assets/learn-button.png";
import * as homeButton from "../../Assets/home-button.png";
import * as logo from "../../Assets/betfluent-logo-and-text.png";

import { gMuiTheme } from "./Styles";
import { mgMuiTheme } from "./ManagerStyles";
import { Z_FIXED } from "zlib";

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const usernameColor = '#000000';

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

    const nameStyle = {
      color: this.props.isManager ? managerThemeColor : usernameColor,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      marginBottom: 16
    };

    const headerContainer = {
      position: 'fixed',
      width: '100%',
      marginTop: -2
    };

    const headerContainerTop = {
      height: '50%',
      marginTop: -84
    };

    const headerBackgroundContainer = {
      flex: 1,
      width: undefined,
      height: undefined,
      backgroundColor:'transparent'
    };

    const logoStyle = {
      width: '40%',
      marginLeft: -210
    };

    const buttonStyle = {
      width: 105
    };

    const navigationButtonStyle = {
      width: 77
    };

    const buttonContainer = { 
      height: '50%',
      marginLeft: 165,
      marginTop: -44
    }

    const navigationContainer = { 
      height: '50%',
      marginLeft: -212,
      marginTop: 10
    }

    const iLocation = this.props.history.location.pathname;

    return (
      <div style={headerContainer}>

        <img src={topBarShape} style={headerBackgroundContainer}/>

        <div style={headerContainerTop}>
          <Link to="/">
            <img src={logo} style={logoStyle}/>
          </Link>
        </div>

        <div style={navigationContainer}>
          <Link to="/">
            <img src={learnButton} style={navigationButtonStyle}/>
          </Link>
          <Link to="/lobby">
            <img src={homeButton} style={navigationButtonStyle}/>
          </Link>
        </div>

        <div style={buttonContainer}>
          <Link to="/login">
            <img src={signInButton} style={buttonStyle}/>
          </Link>
          <Link to="/register">
            <img src={registerButton} style={buttonStyle}/>
          </Link>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.authUser && state.authUser.authUser
});

export default connect(mapStateToProps)(MobileTopHeader);
