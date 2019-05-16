// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import moment from "moment";
import EmptyPlayList from "material-ui/svg-icons/av/featured-play-list";
import { getOpenFundsFeed } from "../../Services/DbService";
import { appTheme, gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import ManagerRow from "./ManagerRow";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few Seconds",
    ss: "%d Seconds",
    m: "1 Minute",
    mm: "%d Minutes",
    h: "1 Hour",
    hh: "%d Hours",
    d: "1 Day",
    dd: "%d Days",
    M: "1 Month",
    MM: "%d Months",
    y: "1 Year",
    yy: "%d Years"
  }
});

const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

let scrollPosition = 0;
const onScroll = () => {
  if (document.scrollingElement) {
    scrollPosition = document.scrollingElement.scrollTop;
  }
};



type FundsProps = {
  user: User,
  isManager: boolean,
  size: number
};

export default class Funds extends Component<FundsProps> {
  constructor() {
    super();
    this.onFundsChange = this.onFundsChange.bind(this);
  }

  componentDidMount() {
    this.fundsFeed = getOpenFundsFeed(this.onFundsChange);
    window.addEventListener("scroll", onScroll);
    window.setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);
  }

  componentWillUnmount() {
    if (this.fundsFeed) this.fundsFeed.off();
    window.removeEventListener("scroll", onScroll);
  }

  onFundsChange(fundArray) {
    const funds = fundArray.sort((a, b) => a.closingTime - b.closingTime);
    const fundsByManager = funds.reduce((obj, item) => {
      if (!obj[item.managerId]) {
        obj[item.managerId] = item.manager;
        obj[item.managerId].funds = [];
      }
      obj[item.managerId].funds.push(item);
      return obj;
    }, {})

    const fundsByManagerArr = Object.keys(fundsByManager).map(k => ({ ...fundsByManager[k] }));

    console.log(fundsByManagerArr);

    this.setState({
      managers: fundsByManagerArr
    });
  }

  render() {
    if (!this.props.user || !this.state || !this.state.managers)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    return (
      <V0MuiThemeProvider
        muiTheme={this.props.isManager ? mgMuiTheme : gMuiTheme}
      >
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
            { this.state.managers ?
              this.state.managers.map((m, i) => <ManagerRow key={i} manager={m} user={this.props.user} size={this.props.size} />)
            : (
              <div className="emptyPageHolder">
                <EmptyPlayList />
                <p>
                  Looks like there aren&apos;t any open pools. <br />
                  Check back later to get in on the action.
                </p>
              </div>
            )}
            <div className="clear" />
        </div>
      </V0MuiThemeProvider>
    );
  }
}
