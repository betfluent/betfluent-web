// @flow

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { Card, CardHeader, CardTitle } from "material-ui/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "material-ui/Divider";
import LinearProgress from "material-ui/LinearProgress";
import Moment from "react-moment";
import moment from "moment";
import { IntlProvider, FormattedNumber } from "react-intl";
import Alarm from "material-ui/svg-icons/action/alarm";
import EmptyPlayList from "material-ui/svg-icons/av/featured-play-list";
import { getOpenFundsFeed } from "../../Services/DbService";
import { appTheme, gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import OdometerExt from "../../Extensions/OdometerExt";
import CountDown from "../CountDown";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import Avatar from "../Avatar";

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

const themeColor = gMuiTheme.palette.themeColor;
const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

let scrollPosition = 0;
const onScroll = () => {
  if (document.scrollingElement) {
    scrollPosition = document.scrollingElement.scrollTop;
  }
};

type WagerRatioProps = {
  wagerRatioStyle: {},
  isManager: boolean,
  fund: {
    amountWagered: number,
    maxBalance: number
  }
};

const WagerRatio = (props: WagerRatioProps) => (
  <div style={props.wagerRatioStyle}>
    <span
      style={{
        color: props.isManager
          ? mgMuiTheme.palette.themeColor
          : gMuiTheme.palette.themeColor
      }}
    >
      $<OdometerExt
        value={props.fund.amountWagered ? props.fund.amountWagered / 100 : 0}
        format="(,ddd)"
      />
    </span>
    <span
      style={{
        color: props.isManager
          ? mgMuiTheme.palette.textColor3
          : gMuiTheme.palette.textColor3
      }}
    >
      {" / "}
      <FormattedNumber
        style="currency"
        currency="USD"
        minimumFractionDigits={0}
        value={props.fund.maxBalance / 100}
      />
    </span>
  </div>
);

type FundsProps = {
  user: User,
  isManager: boolean,
  size: number
};

export default class Funds extends Component<FundsProps> {
  static maxInvestment(fund) {
    if (!fund.amountWagered) return 0;
    return fund.amountWagered / fund.maxBalance * 100;
  }

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
    this.setState({
      funds
    });
  }

  static renderTime(closingTime) {
    const diff = closingTime - Date.now() / 1000;
    if (diff / 3600 > 1) {
      return <Moment key={0} fromNow ago date={closingTime * 1000} />;
    }
    return <CountDown diff={diff} />;
  }

  renderCardContent = fund => {
    const titleStyle = {
      textAlign: "left",
      padding: 0
    };

    const cardTitleStyle = {
      color: "#000",
      fontSize: 14,
      lineHeight: "16px",
      margin: "0 0 8px 4px"
    };

    const subtitleStyle = {
      fontSize: 12,
      marginLeft: 4
    };

    return (
      <div className="flexContainer poolCardContent">
        <div className="bettingManagerInfo">
          <Avatar
            width={64}
            userName={fund.manager.name}
            userAvatar={fund.manager.avatarUrl}
          />
          <p title={fund.manager.name}>{fund.manager.name}</p>
        </div>
        <div className="poolDetail">
          <CardTitle
            style={titleStyle}
            titleStyle={cardTitleStyle}
            title={fund.name}
            subtitleStyle={subtitleStyle}
            subtitle={[
              `${fund.league} ${fund.type}`,
              <div key={0} style={{ height: 5 }} />,
              fund.playerCount ? fund.playerCount : "0",
              " Players \u00B7 $",
              fund.minInvestment / 100,
              " Minimum \u00B7 ",
              fund.percentFee,
              "% Fee"
            ]}
          />
          {this.props.user.investments &&
          this.props.user.investments[fund.id] ? (
            <div className="wageredTag" style={{ color: themeColor }}>
              Wagered ${this.props.user.investments[fund.id] / 100}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    if (!this.props.user || !this.state || !this.state.funds)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    const cardHeaderStyle = {
      textAlign: "left",
      paddingLeft: "8px",
      paddingRight: "8px",
      paddingTop: "8px",
      paddingBottom: "10px"
    };

    const cardHeaderTitleStyle = {
      color: textColor3,
      display: "inline",
      fontSize: 12,
      fontWeight: 400
    };

    const linearStyle = {
      position: "absolute",
      right: 20,
      display: "inline",
      width: 48,
      height: 8,
      borderRadius: 6,
      top: 15,
      backgroundColor: this.props.isManager
        ? "rgba(17,204,136,0.2)"
        : "rgba(90,150,255,0.2)"
    };

    const wagerRatioStyle = {
      position: "absolute",
      right: 78,
      display: "inline",
      top: 13
    };

    const alarmStyle = {
      height: 16,
      verticalAlign: "bottom",
      marginLeft: 6,
      marginBottom: -1,
      fill: textColor3
    };

    const timeStyle = {
      position: "absolute",
      bottom: 10
    };

    const mainStyle = {
      height: "156px"
    };

    return (
      <V0MuiThemeProvider
        muiTheme={this.props.isManager ? mgMuiTheme : gMuiTheme}
      >
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}

          <ul className="FundCards" id="FundCardsList">
            {this.state && this.state.funds && this.state.funds.length !== 0 ? (
              Object.keys(this.state.funds)
                .map(k => this.state.funds[k])
                .map((fund, index) => (
                  <li
                    key={index}
                    className="contentHeader FundCard"
                    id={fund.id}
                  >
                    <Link key={fund.id} to={`/pools/${fund.id}`}>
                      <IntlProvider locale="en">
                        <Card
                          style={mainStyle}
                          zDepth={2}
                          className="FundCardItem"
                        >
                          <CardHeader
                            title={[
                              <Alarm key={11} style={alarmStyle} />,
                              <span key={10} style={timeStyle}>
                                {Funds.renderTime(fund.closingTime)} Left
                              </span>,
                              <WagerRatio
                                key={7}
                                isManager={this.props.isManager}
                                fund={fund}
                                wagerRatioStyle={wagerRatioStyle}
                              />,
                              <LinearProgress
                                key={6}
                                style={linearStyle}
                                mode="determinate"
                                value={Funds.maxInvestment(fund)}
                              />
                            ]}
                            titleStyle={cardHeaderTitleStyle}
                            style={cardHeaderStyle}
                          />
                          <Divider />
                          <CardContent>
                            {this.renderCardContent(fund)}
                          </CardContent>
                        </Card>
                      </IntlProvider>
                    </Link>
                  </li>
                ))
            ) : (
              <div className="emptyPageHolder">
                <EmptyPlayList />
                <p>
                  Looks like there aren&apos;t any open pools. <br />
                  Check back later to get in on the action.
                </p>
              </div>
            )}
            <div className="clear" />
          </ul>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
