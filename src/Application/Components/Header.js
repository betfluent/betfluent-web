// @flow
/* eslint-disable */

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import Drawer from "material-ui/Drawer";
import RaisedButton from "material-ui/RaisedButton";
import {
  BottomNavigation,
  BottomNavigationItem
} from "material-ui/BottomNavigation";
import { IntlProvider } from "react-intl";
import Divider from "material-ui/Divider";
import ActionAccountCircle from "material-ui/svg-icons/action/account-circle";
import Work from "material-ui/svg-icons/action/work";
import AvFeaturedPlayList from "material-ui/svg-icons/av/featured-play-list";
import ActionHistory from "material-ui/svg-icons/action/history";
import School from "material-ui/svg-icons/social/school";
import Build from "material-ui/svg-icons/image/edit";
import Badge from "material-ui/Badge";
import { MenuItem } from "material-ui";
import { getUserInteractionsCount } from "../Services/DbService";
import { signOut } from "../Services/AuthService";
import { gMuiTheme } from "./Styles";
import { mgMuiTheme } from "./ManagerStyles";
import OdometerExt from "../Extensions/OdometerExt";
import WinningConfetti from "./WinningConfetti";

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;
const desktopBreakPoint = gMuiTheme.palette.desktopBreakPoint;

type LoggedProps = {
  bottomNavStyle: {},
  selectedIndex: number,
  isManager: boolean,
  unread: boolean
};

const HistoryLabelWithBadge = props => (
  <Badge
    badgeContent={props.unread ? props.unread : 0}
    style={{ padding: 0 }}
    badgeStyle={{
      left: -17,
      top: -8,
      borderRadius: "25%",
      width: "17px",
      height: "17px",
      fontSize: "10px",
      backgroundColor: "#ff3322",
      display: props.unread > 0 ? "flex" : "none"
    }}
    primary
  >
    Recent
  </Badge>
);

const HistoryWithBadge = props => (
  <Badge
    badgeContent={props.unread ? props.unread : 0}
    style={{ padding: 0, height: "24px" }}
    badgeStyle={{
      top: -5,
      right: 12,
      borderRadius: "25%",
      width: "17px",
      height: "17px",
      fontSize: "10px",
      backgroundColor: "#ff3322",
      display: props.unread > 0 ? "flex" : "none"
    }}
    primary
  >
    <ActionHistory
      style={{
        fill:
          props.selectedIndex === 2
            ? "rgb(26, 102, 26)"
            : "rgba(0, 0, 0, 0.54)"
      }}
    />
  </Badge>
);

const unauthenticatedMenu = [
  {
    label: "Lobby",
    icon: AvFeaturedPlayList,
    url: "/",
    index: 0
  },
  {
    label: "Learn",
    icon: School,
    url: "/learn",
    index: 1
  }
]

const clientMenuMobile = [
  {
    label: "Lobby",
    icon: AvFeaturedPlayList,
    url: "/"
  },
  {
    label: "Portfolio",
    icon: Work,
    url: "/portfolio"
  },
  {
    label: "Recent",
    icon: HistoryWithBadge,
    url: "/recent"
  },
  {
    label: "Account",
    icon: ActionAccountCircle,
    url: "/account"
  }
];

const clientMenu = [
  {
    label: "Lobby",
    icon: AvFeaturedPlayList,
    url: "/",
    index: 0
  },
  {
    label: "Portfolio",
    icon: Work,
    url: "/portfolio",
    index: 1
  },
  {
    label: false,
    labelIcon: HistoryLabelWithBadge,
    icon: ActionHistory,
    url: "/recent",
    index: 2
  },
  {
    label: "Learn",
    icon: School,
    url: "/learn",
    index: 4
  },
  {
    label: "Account",
    icon: ActionAccountCircle,
    url: "/account",
    index: 3
  }
];

const managerMenu = [
  {
    label: "Lobby",
    icon: AvFeaturedPlayList,
    url: "/",
    index: 0
  },
  {
    label: "Portfolio",
    icon: Work,
    url: "/portfolio",
    index: 1
  },
  {
    label: false,
    labelIcon: HistoryLabelWithBadge,
    icon: ActionHistory,
    url: "/recent",
    index: 2
  },
  {
    label: "Create",
    icon: Build,
    url: "/manage",
    index: 3,
  },
  {
    label: "Learn",
    icon: School,
    url: "/learn",
    index: 4
  },
  {
    label: "Account",
    icon: ActionAccountCircle,
    url: "/account",
    index: 5
  }
];

const Logged = (props: LoggedProps) => {
  const menu = props.isManager ? managerMenu : clientMenuMobile;
  return (
    <BottomNavigation
      style={props.bottomNavStyle}
      selectedIndex={props.selectedIndex}
      className="mobileMenu"
    >
      {menu.map(({ label, icon: Icon, url }, i) => (
        <BottomNavigationItem
          key={i}
          label={label}
          icon={
            <Icon
              style={{ ...props.style }}
              selectedIndex={props.selectedIndex}
              unread={props.unread}
            />
          }
          containerElement={<Link to={url} />}
        />
      ))}
    </BottomNavigation>
  );
};

Logged.muiName = "IconMenu";

type DesktopIconsType = {
  activeStyle: {},
  inactiveStyle: {},
  activeIconStyle: {},
  inactiveIconStyle: {},
  primaryTextStyle: {},
  selectedIndex: number,
  isManager: boolean,
  isAuthenticated: boolean,
  unread: boolean
};

const DesktopIcons = (props: DesktopIconsType) => {
  let list;
  if (props.isManager) list = managerMenu;
  else if (props.isAuthenticated) list = clientMenu;
  else list = unauthenticatedMenu;

  return (
    <div style={{ paddingBottom: 56 }}>
      {list.map(
        ({ label, labelIcon: LabelIcon, icon: Icon, url, index }, i) => (
          <MenuItem
            key={i}
            style={
              (index && index === props.selectedIndex) ||
              (!index && i === props.selectedIndex)
                ? props.activeStyle
                : props.inactiveStyle
            }
            leftIcon={
              <Icon
                style={
                  (index && index === props.selectedIndex) ||
                  (!index && i === props.selectedIndex)
                    ? props.activeIconStyle
                    : props.inactiveIconStyle
                }
              />
            }
            primaryText={label ? label : <LabelIcon {...props} />}
            innerDivStyle={props.primaryTextStyle}
            containerElement={<Link to={url} />}
          />
        )
      )}
    </div>
  );
};

type HeaderProps = {
  history: {
    push: () => void,
    location: {
      pathname: string
    }
  },
  user: User,
  authUser: {
    emailVerified: boolean
  },
  setLock: () => void,
  size: number,
  isManager: boolean
};

export default class Header extends Component<HeaderProps> {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.gotoDeposit = this.gotoDeposit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.setRoute(this.props);
    this.setData(this.props);
    if (this.props.user) {
      this.interactionsCount = getUserInteractionsCount(
        this.props.user.id,
        unread => {
          this.setState({ unread });
        }
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setRoute(this.props);
      this.setData(this.props);
    }
  }

  componentWillUnmount() {
    if (this.interactionsCount) this.interactionsCount.off();
  }

  setRoute = props => {
    const iLocation = props.history.location.pathname;
    let selectedIndex = 0;
    if (!!props.authUser && !props.isManager) {
      switch (iLocation) {
        case "/":
          selectedIndex = 0;
          this.setState({ selectedIndex });
          break;
        case "/portfolio":
          selectedIndex = 1;
          this.setState({ selectedIndex });
          break;
        case "/recent":
          selectedIndex = 2;
          this.setState({ selectedIndex });
          break;
        case "/account":
          selectedIndex = 3;
          this.setState({ selectedIndex });
          break;
        case "/learn":
          selectedIndex = 4;
          this.setState({ selectedIndex });
          break;
        default:
          selectedIndex = this.state.selectedIndex;
          this.setState({ selectedIndex });
      }
    } else if (!!props.authUser && props.isManager) {
      switch (iLocation) {
        case "/":
          selectedIndex = 0;
          this.setState({ selectedIndex });
          break;
        case "/portfolio":
          selectedIndex = 1;
          this.setState({ selectedIndex });
          break;
        case "/recent":
          selectedIndex = 2;
          this.setState({ selectedIndex });
          break;
        case "/manage":
          selectedIndex = 3;
          this.setState({ selectedIndex });
          break;
        case "/account":
          selectedIndex = 5;
          this.setState({ selectedIndex });
          break;
        case "/learn":
          selectedIndex = 4;
          this.setState({ selectedIndex });
          break;
        default:
          selectedIndex = this.state.selectedIndex;
          this.setState({ selectedIndex });
      }
    } else {
      switch (iLocation) {
        case "/":
          selectedIndex = 0;
          this.setState({ selectedIndex });
          break;
        case "/learn":
          selectedIndex = 1;
          this.setState({ selectedIndex });
          break;
        default:
          selectedIndex = this.state.selectedIndex;
          this.setState({ selectedIndex });
      }
    }
  };

  setData(props) {
    const data = [];
    if (props.user) {
      data.push({ value: props.user.balance / 100 });

      const returnKeys = props.user.returns
        ? Object.keys(props.user.returns)
        : [];
      const investments = props.user.investments
        ? Object.keys(props.user.investments).reduce((total, key) => {
            if (!returnKeys.includes(key))
              return total + Math.abs(props.user.investments[key]);
            return total;
          }, 0)
        : 0;
      data.push({ value: investments / 100 });
    }
    this.setState({ data });
  }

  logout() {
    signOut().then(() => {
      this.props.setLock(true);
    });
  }

  gotoDeposit() {
    if (this.props.authUser) this.props.history.push("/account/deposit");
    else this.props.history.push("/login");
  }

  render() {
    const primaryTextStyle = {
      padding: "0 0 0 36px"
    };

    const activeStyle = {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      padding: "12px 0",
      paddingLeft: this.props.size > desktopBreakPoint ? 76 : 48,
      marginBottom: 4,
      textAlign: "left",
      color: this.props.isManager ? managerThemeColor : themeColor,
      borderRight: `3px solid ${
        this.props.isManager ? managerThemeColor : themeColor
      }`
    };

    const inactiveStyle = {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      padding: "12px 0",
      paddingLeft: this.props.size > desktopBreakPoint ? 76 : 48,
      marginBottom: 4,
      textAlign: "left",
      color: textColor3
    };

    const activeIconStyle = {
      fill: this.props.isManager ? managerThemeColor : themeColor,
      margin: 0
    };

    const inactiveIconStyle = {
      fill: textColor3,
      margin: 0
    };

    const bottomNavStyle = {
      position: "fixed",
      bottom: 0,
      opacity: 1,
      zIndex: 999
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

    const renderUserData = () => {
      const { authUser, user } = this.props;
      const { data } = this.state;

      if (!this.props.isManager) {
        return (
          <div style={{ height: 236 }}>
            <div style={nameStyle}>{user && user.public.name}</div>
            <div style={balanceTitleStyle}>AVAILABLE BALANCE</div>
            <div style={balanceStyle}>
              $<span style={{ position: "relative", bottom: 2 }}>
                <OdometerExt
                  value={data.length && data[0].value + 0.001}
                  format="(,ddd).ddd"
                />
              </span>
            </div>
            <div style={balanceTitleStyle}>AMOUNT WAGERED</div>
            <div style={balanceStyle}>
              $<span style={{ position: "relative", bottom: 2 }}>
                <OdometerExt
                  value={data.length && data[1].value + 0.001}
                  format="(,ddd).ddd"
                />
              </span>
            </div>
            <RaisedButton
              style={{ width: 128 }}
              primary
              disabled={authUser && !authUser.emailVerified}
              onClick={() => this.gotoDeposit()}
              label={authUser ? "DEPOSIT" : "SIGN IN"}
            />
          </div>
        );
      }
      return <div style={nameStyle}>{this.props.user ? this.props.user.name : ''}</div>;
    };

    const renderHeader = () => {
      if (this.state.data) {
        if (this.props.size > mobileBreakPoint) {
          return (
            <IntlProvider key={0} locale="en">
              <Drawer
                open
                width={this.props.size > desktopBreakPoint ? 240 : 184}
              >
                <Link to="/">
                  <img
                    alt="Betfluent Logo"
                    src={
                      this.props.isManager
                        ? "/bf-logo.png"
                        : "/bf-logo.png"
                    }
                    height={48}
                    style={logoStyle}
                  />
                </Link>
                {renderUserData()}
                <Divider style={dividerStyle} />
                <DesktopIcons
                  isManager={this.props.isManager}
                  isAuthenticated={!!this.props.authUser}
                  selectedIndex={this.state.selectedIndex}
                  unread={this.state.unread}
                  activeStyle={activeStyle}
                  inactiveStyle={inactiveStyle}
                  activeIconStyle={activeIconStyle}
                  inactiveIconStyle={inactiveIconStyle}
                  primaryTextStyle={primaryTextStyle}
                />
              </Drawer>
            </IntlProvider>
          );
        }
        return !!this.props.authUser ? (
            <Logged
              key={11}
              isManager={this.props.isManager}
              isAuthenticated={!!this.props.authUser}
              selectedIndex={this.state.selectedIndex}
              unread={this.state.unread}
              activeStyle={activeStyle}
              inactiveStyle={inactiveStyle}
              bottomNavStyle={bottomNavStyle}
            />
          )
          : (
            <div className="header-sign-in" onClick={() => this.props.history.push("/login")}>
              SIGN IN
            </div>
          )
      }
      return null;
    };

    return (
      <MuiThemeProvider
        muiTheme={this.props.isManager ? mgMuiTheme : gMuiTheme}
      >
        <div>
          {renderHeader()}
          <WinningConfetti user={this.props.user} unread={this.state.unread} />
        </div>
      </MuiThemeProvider>
    );
  }
}
