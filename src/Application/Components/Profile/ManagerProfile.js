// @flow
/* eslint-disable */

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { Card } from "material-ui/Card";
import Divider from "material-ui/Divider";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import EmptySport from "material-ui/svg-icons/editor/insert-chart";
import Alert from "@material-ui/icons/ErrorOutline";
import { IntlProvider, FormattedNumber } from "react-intl";
import keyBy from "lodash/keyBy";
import filter from "lodash/filter";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import moment from "moment";
import {
  getManagerStats,
  getFundsFeed,
  getWagersByTime
} from "../../Services/ManagerService";
import { appTheme, gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import Avatar from "../Avatar";
import Manager from "../../Models/Manager";

const themeColor = gMuiTheme.palette.themeColor;
const mgthemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor2 = mgMuiTheme.palette.textColor2;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;
const mobileBreakPoint = mgMuiTheme.palette.mobileBreakPoint;

const titleStyle = {
  color: textColor1,
  fontSize: 12,
  lineHeight: "14px",
  fontWeight: 500
};

const subtitleStyle = {
  color: textColor3,
  fontSize: 12,
  lineHeight: "14px"
};

const numberStyle = {
  color: textColor2,
  fontSize: 20,
  lineHeight: "24px"
};

const renderNumber = num => {
  if (isNaN(num)) {
    return 0;
  }
  return Math.abs(num);
};

const renderStreak = streak => {
  if (isNaN(streak) || streak === 0) {
    return 0;
  } else if (streak > 0) {
    return <span style={{ color: mgthemeColor }}>W{Math.abs(streak)}</span>;
  }
  return <span style={{ color: alertColor }}>L{Math.abs(streak)}</span>;
};

type PerformanceProps = {
  isManager: boolean,
  manager: Manager,
  size: number
};

export default class Performance extends Component<PerformanceProps> {
  constructor(props) {
    super(props);
    this.sevenDays = moment()
      .subtract(7, "d")
      .valueOf();
    this.state = {
      timeframe: 0,
      league: "all"
    };
  }

  componentDidMount() {
    if (!this.statsContainerRendered) this.renderStatsContainer();
    this.getStats(this.props.manager.id);
    this.getFunds(this.props.manager.id);
  }

  componentDidUpdate() {
    if (!this.statsContainerRendered) this.renderStatsContainer();
  }

  getWagersByDay = funds => {
    getWagersByTime().then(wagersObj => {
      const wagers = Object.keys(wagersObj || {}).map(k => wagersObj[k]);

      const wagersTime = wagers.filter(
        w => w.createdTimeMillis >= this.sevenDays
      );

      const fundKeys = keyBy(funds, fund => fund.id);

      const managerWagers = filter(
        wagers,
        w => fundKeys[w.request.fundId] !== undefined
      );

      const managerWagersTime = filter(
        wagersTime,
        w => fundKeys[w.request.fundId] !== undefined
      );

      const wagerAmounts = managerWagers.map(wager => {
        const createdTimeMillis = wager.createdTimeMillis || wager.dateCreated;
        const amount = wager.request.amount;
        return { createdTimeMillis, amount };
      });

      const wagerAmountsTime = managerWagersTime.map(wager => {
        const createdTimeMillis = wager.createdTimeMillis || wager.dateCreated;
        const amount = wager.request.amount;
        return { createdTimeMillis, amount };
      });

      let groupedWagers = groupBy(wagerAmounts, result =>
        moment(result.createdTimeMillis).day()
      );

      let groupedWagersTime = groupBy(wagerAmountsTime, result =>
        moment(result.createdTimeMillis).day()
      );

      groupedWagers = mapValues(groupedWagers, v => {
        const amountsArray = v.map(obj => obj.amount);
        return amountsArray.reduce((t, i) => {
          if (i !== undefined) return t + i;
          return t + 0;
        }, 0);
      });

      groupedWagersTime = mapValues(groupedWagersTime, v => {
        const amountsArray = v.map(obj => obj.amount);
        return amountsArray.reduce((t, i) => {
          if (i !== undefined) return t + i;
          return t + 0;
        }, 0);
      });

      this.setState({ groupedWagers, groupedWagersTime });
    });
  };

  getFunds = managerId => {
    getFundsFeed(managerId, funds => {
      funds.sort((a, b) => a.createdTimeMillis - b.createdTimeMillis);
      const returnedFunds = funds.filter(fund => fund.status === "RETURNED");
      let totalWager = 0;
      let totalProfit = 0;
      let totalReturn = 0;
      returnedFunds.filter(fund => !fund.isTraining).forEach(fund => {
        totalWager += fund.amountWagered;
        totalProfit += fund.managerReturn();
        totalReturn += fund.amountReturned;
      });
      this.setState({ funds, totalWager, totalProfit, totalReturn });
      if (this.props.isManager) {
        this.getWagersByDay(funds);
      }
    });
  };

  getStats = managerId => {
    getManagerStats(managerId).then(stats => {
      this.setState({ stats });
    });
  };

  handleTimeframeChange = (event, index, timeframe) => {
    const managerId = this.props.manager.id;
    if (timeframe === "training") {
      getManagerStats(managerId, 0, true).then(stats => {
        this.setState({ stats });
      });
    } else if (timeframe === 0) {
      getManagerStats(managerId).then(stats => {
        this.setState({ stats });
      });
    } else {
      const timeMillis = moment()
        .subtract(timeframe, "d")
        .valueOf();
      getManagerStats(managerId, timeMillis, false).then(stats => {
        this.setState({ stats });
      });
    }
    this.setState({ timeframe });
  };

  handleLeagueChange = (event, index, league) => this.setState({ league });

  renderStatsContainer() {
    if (this.statsContainer) {
      this.statsContainerRendered = true;
      const statsContainer = this.statsContainer;
      const statsRect = statsContainer.getBoundingClientRect();
      statsContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - statsRect.top
          : window.innerHeight - statsRect.top - 56
      }px`;
    }
  }

  renderTotalStats = (count, amount, numColor) => (
    <IntlProvider locale="en">
      <div className="performanceCardBody">
        <div style={numberStyle}>
          {renderNumber(count)} ·{" "}
          <span style={{ color: numColor }}>
            <FormattedNumber
              style="currency"
              currency="USD"
              value={renderNumber(amount / 100)}
            />
          </span>
        </div>
        <div style={subtitleStyle}>Count · Amount</div>
      </div>
    </IntlProvider>
  );

  renderStatsByBetType = (stats, betType) => {
    let statsBetType = betType.toLowerCase();
    if (statsBetType === "over/under") {
      statsBetType = "overUnder";
    }
    let statsByBetType = {
      placedCount: 0,
      winCount: 0,
      loseCount: 0,
      pushCount: 0,
      placedAmount: 0,
      winAmount: 0,
      loseAmount: 0,
      pushAmount: 0,
      currentStreak: 0,
      longestStreak: 0
    };
    if (stats[statsBetType]) {
      statsByBetType = stats[statsBetType];
    }
    if (statsBetType === "") {
      statsByBetType = stats;
    }
    const totalCount =
      renderNumber(statsByBetType.winCount) +
      renderNumber(statsByBetType.loseCount) +
      renderNumber(statsByBetType.pushCount);
    let winPct = (
      100 *
      renderNumber(statsByBetType.winCount) /
      totalCount
    ).toFixed(2);
    if (isNaN(winPct)) {
      winPct = 0;
    }
    let losePct = (
      100 *
      renderNumber(statsByBetType.loseCount) /
      totalCount
    ).toFixed(2);
    if (isNaN(losePct)) {
      losePct = 0;
    }
    let pushPct = (
      100 *
      renderNumber(statsByBetType.pushCount) /
      totalCount
    ).toFixed(2);
    if (isNaN(pushPct)) {
      pushPct = 0;
    }

    return (
      <div>
        <div className="flexContainer" style={{ alignItems: "stretch" }}>
          <Card zDepth={2} className="performanceCard betsPlacedCard">
            <div className="performanceCardHeader">
              <span style={subtitleStyle}>Bets Placed</span>
            </div>
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            {this.renderTotalStats(
              statsByBetType.placedCount,
              statsByBetType.placedAmount,
              mgthemeColor
            )}
          </Card>
          <Card zDepth={2} className="performanceCard streaksCard">
            <div className="performanceCardHeader">
              <span style={subtitleStyle}>Streaks</span>
            </div>
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            <div className="performanceCardBody">
              <div style={numberStyle}>
                {renderStreak(statsByBetType.currentStreak)} ·{" "}
                {renderStreak(statsByBetType.longestStreak)}
              </div>
              <div style={subtitleStyle}>Current · Longest</div>
            </div>
          </Card>
        </div>
        <Card zDepth={2} className="performanceCard">
          <div className="performanceCardHeader">
            <span style={subtitleStyle}>Bet Results</span>
          </div>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
          <div className="flexContainer">
            <div style={{ flexGrow: 1 }}>
              <div className="numberType">
                <span style={titleStyle}>Win </span>
                <span
                  style={{
                    color: mgthemeColor,
                    marginLeft: 8,
                    fontWeight: 300
                  }}
                >
                  ( {winPct}% )
                </span>
              </div>
              {this.renderTotalStats(
                statsByBetType.winCount,
                statsByBetType.winAmount,
                mgthemeColor
              )}
            </div>
            <div style={{ flexGrow: 1 }}>
              <div className="numberType">
                <span style={titleStyle}>Lose </span>
                <span
                  style={{ color: alertColor, marginLeft: 8, fontWeight: 300 }}
                >
                  ( {losePct}% )
                </span>
              </div>
              {this.renderTotalStats(
                statsByBetType.loseCount,
                statsByBetType.loseAmount,
                alertColor
              )}
            </div>
            <div style={{ flexGrow: 1 }}>
              <div className="numberType">
                <span style={titleStyle}>Push </span>
                <span
                  style={{ color: textColor1, marginLeft: 8, fontWeight: 300 }}
                >
                  ( {pushPct}% )
                </span>
              </div>
              {this.renderTotalStats(
                statsByBetType.pushCount,
                statsByBetType.pushAmount,
                textColor1
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  renderStats = () => {
    const allLeagueStats = this.state.stats;
    const timeframe = this.state.timeframe;
    const league = this.state.league;
    let stats = allLeagueStats;
    let determiner = "my";
    if (!this.props.isManager) {
      const nameArray = this.props.manager.name.split(" ");
      const firstName = nameArray[0];
      determiner = `${firstName}'s`;
    }

    if (league !== "all") {
      stats = allLeagueStats[league];
    }

    if (!stats) {
      return (
        <div className="emptyPortfolio">
          <EmptySport />
          <p>
            No {league !== "all" ? league.toUpperCase() : null} bets in the
            selected timeframe.
          </p>
        </div>
      );
    }

    const groupedWagers = timeframe
      ? this.state.groupedWagersTime
      : this.state.groupedWagers;
    return (
      <div className="tabContent">
        {this.renderStatsByBetType(stats, "")}
        <div className="statsByBetType">
          <div className="statsQuestion">
            How are {determiner}{" "}
            <span style={{ color: textColor1 }}>Moneyline</span> bets
            performing?
          </div>
          {this.renderStatsByBetType(stats, "Moneyline")}
        </div>
        <div className="statsByBetType">
          <div className="statsQuestion">
            How are {determiner}{" "}
            <span style={{ color: textColor1 }}>Spread</span> bets performing?
          </div>
          {this.renderStatsByBetType(stats, "Spread")}
        </div>
        <div className="statsByBetType">
          <div className="statsQuestion">
            How are {determiner}{" "}
            <span style={{ color: textColor1 }}>Over/Under</span> bets
            performing?
          </div>
          {this.renderStatsByBetType(stats, "Over/Under")}
        </div>
        {this.props.isManager ? (
          <div className="statsByDay">
            <div className="statsQuestion">
              What&apos;s the total{" "}
              <span style={{ color: textColor1 }}> user contribution</span> to{" "}
              {determiner} pools{" "}
              <span style={{ color: textColor1 }}> by day</span>?
            </div>
            <Card zDepth={2} className="performanceCard">
              <div className="performanceCardHeader">
                <span style={subtitleStyle}>Total Wagers</span>
              </div>
              <Divider style={{ marginTop: 8, marginBottom: 8 }} />
              <div
                className="performanceCardBody statsDaysNumbers flexContainer"
                style={{ color: mgthemeColor }}
              >
                <div>
                  <div>${groupedWagers[0] / 100 || 0}</div>
                  <div style={subtitleStyle}>Sun</div>
                </div>
                <div>
                  <div>${groupedWagers[1] / 100 || 0}</div>
                  <div style={subtitleStyle}>Mon</div>
                </div>
                <div>
                  <div>${groupedWagers[2] / 100 || 0}</div>
                  <div style={subtitleStyle}>Tue</div>
                </div>
                <div>
                  <div>${groupedWagers[3] / 100 || 0}</div>
                  <div style={subtitleStyle}>Wed</div>
                </div>
                <div>
                  <div>${groupedWagers[4] / 100 || 0}</div>
                  <div style={subtitleStyle}>Thu</div>
                </div>
                <div>
                  <div>${groupedWagers[5] / 100 || 0}</div>
                  <div style={subtitleStyle}>Fri</div>
                </div>
                <div>
                  <div>${groupedWagers[6] / 100 || 0}</div>
                  <div style={subtitleStyle}>Sat</div>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    if (
      !this.state ||
      !this.state.stats ||
      (this.props.isManager && !this.state.groupedWagers)
    )
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    const manager = this.props.manager;
    const stats = this.state.stats;

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

    const statsContainerStyle = {
      paddingTop: 16,
      paddingBottom: 48,
      overflowY: "scroll",
      boxSizing: "border-box",
      textAlign: "left"
    };

    const renderTimeframeOption = timeframeOption => {
      const label = () => {
        switch (timeframeOption) {
          case "training":
            return "Training";
          default:
            return `${timeframeOption} days`;
        }
      };

      const firstRealFund = (Array.isArray(this.state.funds) && this.state.funds.filter(
        fund => !fund.isTraining
      ) || [])[0];
      const now = new Date();
      const currentTimeMillis = now.getTime();
      const startTimeMillis = firstRealFund
        ? firstRealFund.createdTimeMillis
        : currentTimeMillis;

      if (timeframeOption === "training") {
        if (currentTimeMillis - startTimeMillis < 30 * 24 * 3600 * 1000) {
          return <MenuItem value={timeframeOption} primaryText={label()} />;
        }
        return null;
      }

      if (
        currentTimeMillis - startTimeMillis >
        (timeframeOption - 30) * 24 * 3600 * 1000
      ) {
        return <MenuItem value={timeframeOption} primaryText={label()} />;
      }
      return null;
    };

    const renderLeagueOption = leagueOption => {
      const label = leagueOption.toUpperCase();
      if (stats[leagueOption]) {
        return <MenuItem value={leagueOption} primaryText={label} />;
      }
      return null;
    };

    return (
      <V0MuiThemeProvider
        muiTheme={this.props.isManager ? mgMuiTheme : gMuiTheme}
      >
        <div>
          <div className="PerformanceHeader">
            <div className="contentHeader">
              <div
                className="flexContainer"
                style={{ justifyContent: "flex-start" }}
              >
                <Avatar
                  width={80}
                  userName={manager.name}
                  userAvatar={manager.avatarUrl}
                  key={manager.avatarUrl}
                  isManager
                />
                <div style={{ flex: 1 }}>
                  <div style={headerTitleStyle}>{manager.name || null}</div>
                  <div style={headerSubtitleStyle}>
                    {manager.company || null}
                  </div>
                  <div
                    style={{
                      ...headerSubtitleStyle,
                      fontSize: 14,
                      fontWeight: 500,
                      marginTop: 16
                    }}
                  >
                    <span
                      style={{
                        color: this.props.isManager ? mgthemeColor : themeColor
                      }}
                    >
                      {manager.details.specialty || null}
                    </span>{" "}
                    Specialist
                  </div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    ...headerSubtitleStyle,
                    margin: "8px 0 16px",
                    fontSize: 14
                  }}
                >
                  {manager.details ? manager.details.summary : null}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: textColor2 }}
                >
                  <IntlProvider locale="en">
                    <span style={{ color: mgthemeColor }}>
                      <FormattedNumber
                        style="currency"
                        currency="USD"
                        value={this.state.totalWager / 100}
                      />
                    </span>
                  </IntlProvider>
                  <span> Managed · </span>
                  {this.props.isManager ? (
                    <span>
                      <IntlProvider locale="en">
                        <span style={{ color: mgthemeColor }}>
                          <FormattedNumber
                            style="currency"
                            currency="USD"
                            value={this.state.totalProfit / 100}
                          />
                        </span>
                      </IntlProvider>
                      <span> Profit</span>
                    </span>
                  ) : (
                    <span>
                      <IntlProvider locale="en">
                        <span style={{ color: mgthemeColor }}>
                          <FormattedNumber
                            style="currency"
                            currency="USD"
                            value={this.state.totalReturn / 100}
                          />
                        </span>
                      </IntlProvider>
                      <span> Returned</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="FillEdges" />
          <div id="PerformanceDetail" style={{ position: "relative" }}>
            <div className="contentHeader">
              <div
                className="selectors flexContainer"
                style={{
                  justifyContent: "space-around",
                  height: 48,
                  alignItems: "center",
                  fontSize: 14,
                  color: textColor2
                }}
              >
                <div className="flexContainer" style={{ alignItems: "center" }}>
                  <div>Timeframe:</div>
                  <SelectField
                    autoWidth
                    value={this.state.timeframe}
                    onChange={this.handleTimeframeChange}
                    style={{
                      width: 72,
                      height: 24,
                      marginLeft: 12,
                      marginBottom: -8
                    }}
                    iconStyle={{
                      width: 16,
                      height: 16,
                      padding: 0,
                      top: -8
                    }}
                    menuItemStyle={{
                      minHeight: 16,
                      height: 20,
                      fontSize: 14,
                      lineHeight: "20px"
                    }}
                    selectedMenuItemStyle={{
                      color: this.props.isManager ? mgthemeColor : themeColor
                    }}
                    labelStyle={{
                      color: this.props.isManager ? mgthemeColor : themeColor,
                      height: 20,
                      fontSize: 14,
                      lineHeight: "20px",
                      paddingRight: 12
                    }}
                  >
                    {renderTimeframeOption("training")}
                    {renderTimeframeOption(30)}
                    {renderTimeframeOption(60)}
                    {renderTimeframeOption(90)}
                    {renderTimeframeOption(180)}
                    <MenuItem value={0} primaryText="ALL" />
                  </SelectField>
                </div>
                <div className="flexContainer" style={{ alignItems: "center" }}>
                  <div>League:</div>
                  <SelectField
                    autoWidth
                    value={this.state.league}
                    onChange={this.handleLeagueChange}
                    style={{
                      width: 72,
                      height: 24,
                      marginLeft: 12,
                      marginBottom: -8
                    }}
                    iconStyle={{
                      width: 16,
                      height: 16,
                      padding: 0,
                      top: -8
                    }}
                    menuItemStyle={{
                      minHeight: 16,
                      height: 20,
                      fontSize: 14,
                      lineHeight: "20px"
                    }}
                    selectedMenuItemStyle={{
                      color: this.props.isManager ? mgthemeColor : themeColor
                    }}
                    labelStyle={{
                      color: this.props.isManager ? mgthemeColor : themeColor,
                      height: 20,
                      fontSize: 14,
                      lineHeight: "20px",
                      paddingRight: 12
                    }}
                  >
                    <MenuItem value="all" primaryText="ALL" />
                    {renderLeagueOption("fifa")}
                    {renderLeagueOption("mlb")}
                    {renderLeagueOption("nba")}
                    {renderLeagueOption("ncaaf")}
                    {renderLeagueOption("ncaamb")}
                    {renderLeagueOption("nfl")}
                  </SelectField>
                </div>
              </div>
            </div>
            <div
              style={statsContainerStyle}
              ref={statsContainer => {
                this.statsContainer = statsContainer;
              }}
            >
              <div className="tabContent">
                {this.state.timeframe === "training" ? (
                  <div className="moneyAlert">
                    <span
                      style={{ color: textColor2, backgroundColor: "#fff" }}
                    >
                      <Alert style={{ fontSize: 16, marginBottom: -4 }} />
                      The money is simulated, but the bets are on real games.
                    </span>
                  </div>
                ) : null}
                {this.renderStats()}
              </div>
            </div>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
