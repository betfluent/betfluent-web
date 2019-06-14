// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "material-ui/Card";
import Divider from "material-ui/Divider";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import LinearProgress from "material-ui/LinearProgress";
import RaisedButton from "material-ui/RaisedButton";
import EmptyWork from "material-ui/svg-icons/action/work";
import ReturnDate from "@material-ui/icons/EventNote";
import Moment from "react-moment";
import moment from "moment";
import { IntlProvider, FormattedNumber } from "react-intl";
import Alarm from "material-ui/svg-icons/action/alarm";
import Lottie from "react-lottie";
import { getFundsFeed, getFundBets } from "../../Services/ManagerService";
import { mgMuiTheme } from "../ManagerStyles";
import OdometerExt from "../../Extensions/OdometerExt";
import * as spinner from "../../../Assets/spinner.json";
import CountDown from "../CountDown";
import Fund from "../../Models/Fund";

type FundsProps = {
  user: Manager,
  status: string
};

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

const themeColor = mgMuiTheme.palette.themeColor;
const textColor2 = mgMuiTheme.palette.textColor2;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

let scrollPosition = 0;
const onScroll = () => {
  if (document.scrollingElement) {
    scrollPosition = document.scrollingElement.scrollTop;
  }
};

type WagerRatioProps = {
  fund: Fund,
  wagerRatioStyle: {}
};

const WagerRatio = (props: WagerRatioProps) => (
  <div style={props.wagerRatioStyle}>
    <span style={{ color: mgMuiTheme.palette.themeColor }}>
      $<OdometerExt
        value={props.fund.amountWagered ? props.fund.amountWagered / 100 : 0}
        format="(,ddd)"
      />
    </span>
    <span style={{ color: mgMuiTheme.palette.textColor3 }}>
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

export default class Funds extends Component<FundsProps> {
  constructor() {
    super();
    this.onFundsChange = this.onFundsChange.bind(this);
  }

  componentDidMount() {
    if (this.props.user && this.props.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        this.props.user.manager.id,
        this.onFundsChange
      );
    }
    window.addEventListener("scroll", onScroll);
    window.setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        nextProps.user.manager.id,
        this.onFundsChange
      );
    }
  }

  componentWillUnmount() {
    if (this.fundsFeed) this.fundsFeed.off();
    window.removeEventListener("scroll", onScroll);
  }

  onFundsChange(fundArray) {
    const funds = fundArray
      .filter(fund => fund.status === this.props.status)
      .sort((a, b) => b.createdTimeMillis - a.createdTimeMillis);
    const fundBets = funds.map(fund => getFundBets(fund.id));
    Promise.all(fundBets).then(collectiveBets => {
      collectiveBets.forEach((bets, i) => {
        if (bets) {
          funds[i].bets = Object.keys(bets)
            .map(betId => bets[betId])
            .filter(bet => bet.status !== "CANCELED");
        }
      });
      this.setState({ allFunds: fundArray, funds });
    });
  }

  maxInvestment = fund => {
    if (!fund.amountWagered) return 0;
    return fund.amountWagered / fund.maxBalance * 100;
  };

  returnTime = fund => {
    const timeStyle = {
      position: "absolute",
      bottom: 10
    };

    if (fund.status === "PENDING" && fund.returnTimeMillis < 0) {
      return <span key={12}>Manual Return</span>;
    }
    return (
      <span
        key={10}
        style={{
          ...timeStyle,
          display: fund.status !== "RETURNED" ? "inline-block" : "none"
        }}
      >
        {this.renderTime(fund)}
      </span>
    );
  };

  renderTime = fund => {
    let diff;
    let time;
    let nextStatus;
    if (fund.status === "STAGED") {
      diff = fund.openTimeMillis / 1000 - Date.now() / 1000;
      time = fund.openTimeMillis;
      nextStatus = "OPEN";
    } else if (fund.status === "OPEN") {
      diff = fund.closingTime - Date.now() / 1000;
      time = fund.closingTime * 1000;
      nextStatus = "PENDING";
    } else if (fund.status === "PENDING") {
      diff = fund.returnTimeMillis / 1000 - Date.now() / 1000;
      time = fund.returnTimeMillis;
      nextStatus = "RETURNED";
    }

    if (diff / 3600 > 1) {
      return (
        <span>
          <Moment key={0} fromNow ago date={time} /> until {nextStatus}
        </span>
      );
    }
    return (
      <span>
        <CountDown diff={diff} /> until {nextStatus}
      </span>
    );
  };

  render() {
    if (!this.props.user || !this.state || !this.state.funds)
      return (
        <div style={{ padding: "8px 0" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );

    const titleStyle = {
      textAlign: "left"
    };

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

    const cardFooterStyle = {
      textAlign: "left",
      padding: 0
    };

    const materialIconStyle = {
      height: 16,
      verticalAlign: "bottom",
      marginLeft: 6,
      fill: textColor3
    };

    const linearStyle = {
      position: "absolute",
      right: 20,
      display: "inline",
      width: 48,
      height: 8,
      borderRadius: 6,
      top: 15,
      backgroundColor: "rgba(112,23,208, 0.2)"
    };

    const cardTitleStyle = {
      color: "#000",
      fontSize: 14,
      lineHeight: "28px",
      marginLeft: "4px"
    };

    const wagerRatioStyle = {
      position: "absolute",
      right: 78,
      display: "inline",
      top: 13
    };

    const viewFundStyle = {
      position: "absolute",
      color: themeColor,
      right: 20,
      bottom: 9,
      fontWeight: 500,
      fontSize: 14
    };

    const mainStyle = {
      height: "156px"
    };

    const subtitleStyle = {
      fontSize: 12,
      marginLeft: 4
    };

    const createBtnStyle = {
      minWidth: 128,
      position: "absolute",
      bottom: 64,
      left: "50%",
      transform: "translateX(-50%)"
    };

    const triStyle = {
      fontSize: 6,
      padding: 4,
      position: "relative",
      top: -2
    };

    const renderCardTitle = fund => {
      if (fund.status === "RETURNED") {
        const amountWagered = fund.amountWagered / 100;
        const amountCurrent = fund.absValue() / 100;

        const returnPct = () => {
          if (amountWagered === 0) {
            return 0;
          }
          return Math.abs(amountCurrent - amountWagered) / amountWagered;
        };

        const renderColor = () => {
          if (amountCurrent - amountWagered > 0) {
            return themeColor;
          }
          if (amountCurrent - amountWagered === 0) {
            return textColor2;
          }
          return alertColor;
        };

        return [
          <span key={12}>
            <ReturnDate style={materialIconStyle} />
            <Moment fromNow style={{ color: textColor3 }}>
              {fund.returnTimeMillis}
            </Moment>
          </span>,
          <div
            key={13}
            style={{
              position: "absolute",
              right: 16,
              top: 12,
              color: renderColor()
            }}
          >
            <span style={triStyle}>
              {amountCurrent - amountWagered >= 0 ? "▲" : "▼"}
            </span>
            <span>
              <FormattedNumber
                style="percent"
                currency="USD"
                minimumFractionDigits={2}
                value={returnPct()}
              />
            </span>
          </div>
        ];
      }

      return [
        <Alarm key={11} style={materialIconStyle} />,
        this.returnTime(fund),
        <WagerRatio key={7} fund={fund} wagerRatioStyle={wagerRatioStyle} />,
        <LinearProgress
          key={6}
          style={linearStyle}
          mode="determinate"
          value={this.maxInvestment(fund)}
        />
      ];
    };

    const renderBetStatics = fund => {
      let betsCount = 0;
      if (fund.bets) {
        betsCount = fund.bets.length;
      }
      if (fund.status === "STAGED" || fund.status === "OPEN") {
        return (
          <span style={{ color: betsCount > 0 ? textColor2 : alertColor }}>
            {betsCount} Staged Bet{betsCount !== 1 ? "s" : null}
          </span>
        );
      }
      if (fund.status === "PENDING" || fund.status === "RETURNED") {
        return (
          <span style={{ color: betsCount > 0 ? textColor2 : alertColor }}>
            {betsCount} Bet{betsCount !== 1 ? "s" : null}
          </span>
        );
      }
      return null;
    };

    const SubTitle = props => {
      const managerReturn = props.fund.managerReturn() / 100;

      return (
        <div style={{ ...subtitleStyle, marginLeft: 0, lineHeight: "18px" }}>
          {`${props.fund.league} ${props.fund.type}`}
          <br />
          {props.fund.status !== "RETURNED"
            ? [
                props.fund.amountWagered ? props.fund.playerCount : "0",
                " Players \u00B7 $",
                props.fund.minInvestment / 100,
                " Minimum \u00B7 ",
                props.fund.percentFee,
                "% Fee \u00B7 ",
                <span key={0}>{renderBetStatics(props.fund)}</span>
              ]
            : [
                props.fund.amountWagered ? props.fund.playerCount : "0",
                " Players \u00B7 ",
                <FormattedNumber
                  key={0}
                  style="currency"
                  currency="USD"
                  minimumFractionDigits={0}
                  value={props.fund.amountWagered / 100}
                />,
                " Principal \u00B7 ",
                <span
                  key={1}
                  style={{
                    color: managerReturn > 0 ? themeColor : textColor2
                  }}
                >
                  <FormattedNumber
                    style="currency"
                    currency="USD"
                    minimumFractionDigits={0}
                    value={managerReturn}
                  />{" "}
                  Profit
                </span>
              ]}
        </div>
      );
    };

    const renderCreateButton = () => {
      const isTraining = this.props.user.manager.isTraining;
      if (
        this.props.status === "OPEN" &&
        (!isTraining || (isTraining && !this.state.allFunds.length))
      ) {
        return (
          <div>
            <div style={createBtnStyle}>
              <Link to="/manage/pools/create">
                <RaisedButton
                  primary
                  label={isTraining ? "Start Training" : "Create Pool"}
                />
              </Link>
            </div>
            <div style={{ height: 128 }} />
          </div>
        );
      }

      return null;
    };

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <ul className="FundCards" id="FundCardsList">
          {this.state && this.state.funds && this.state.funds.length !== 0 ? (
            this.state.funds.map((fund, index) => (
              <li key={index} className="contentHeader FundCard" id={fund.id}>
                <Link key={fund.id} to={`/manage/pools/${fund.id}`}>
                  <IntlProvider locale="en">
                    <Card style={mainStyle} zDepth={2}>
                      <CardHeader
                        title={renderCardTitle(fund)}
                        titleStyle={cardHeaderTitleStyle}
                        style={cardHeaderStyle}
                      />
                      <Divider />
                      <CardTitle
                        style={titleStyle}
                        titleStyle={cardTitleStyle}
                        title={fund.name}
                        subtitleStyle={subtitleStyle}
                        subtitle={<SubTitle fund={fund} />}
                      />
                      <CardHeader
                        title={
                          <span key={21} style={viewFundStyle}>
                            VIEW POOL
                          </span>
                        }
                        titleStyle={cardHeaderTitleStyle}
                        style={cardFooterStyle}
                      />
                    </Card>
                  </IntlProvider>
                </Link>
              </li>
            ))
          ) : (
            <div className="emptyPortfolio">
              <EmptyWork />
              <p>
                No pools here<br />Go to the OPEN tab to create some pools
              </p>
            </div>
          )}

          {renderCreateButton()}
        </ul>
      </MuiThemeProvider>
    );
  }
}
