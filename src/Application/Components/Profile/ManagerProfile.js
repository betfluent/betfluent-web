// @flow
/* eslint-disable */

import React, { Component } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "material-ui/LinearProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { Card } from "material-ui/Card";
import Divider from "material-ui/Divider";
import Moment from 'react-moment';
import {
  getManagerLongFade,
  getManagerBias,
  getManagerWinStreak,
  getManagerAllTimeHistory,
  getManagerTotalWagered,
  getOpenFundsFeed
} from "../../Services/DbService";
import WagerDialogContainer from "../../Containers/WagerDialogContainer";
import { appTheme, gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import Avatar from "../Avatar";
import Manager from "../../Models/Manager";
import LobbyCard from "../Lobby/LobbyCard";
import * as win from './assets/win.svg';
import * as lose from './assets/lose.svg';
import "./ManagerProfile.css";

const themeColor = gMuiTheme.palette.themeColor;
const mgthemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor2 = mgMuiTheme.palette.textColor2;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;
const mobileBreakPoint = mgMuiTheme.palette.mobileBreakPoint;

const linearStyle = {
  display: "inline",
  position: "absolute",
  width: 256,
  height: 24,
  borderRadius: 8,
  backgroundColor: "rgba(26, 102, 26, 0.2)",
  left: 0
};

const greyLinearStyle = {
  ...linearStyle,
  backgroundColor: "rgba(0, 0, 0, 0.38)"
}


type PerformanceProps = {
  isManager: boolean,
  manager: Manager,
  size: number
};

export default class Performance extends Component<PerformanceProps> {
  componentDidMount() {
    getManagerLongFade(this.props.manager.id)
      .then(longFade => {
        getManagerBias(this.props.manager.id)
          .then(bias => {
            getManagerWinStreak(this.props.manager.id).then(streak => {
              getManagerAllTimeHistory(this.props.manager.id).then(history => {
                getManagerTotalWagered(this.props.manager.id).then(total => {
                  const obj = {
                    longFade,
                    bias,
                    streak,
                    history,
                    total
                  }
                  this.setState(obj);
                });
              });
            });
          });
      });

      this.getOpenFundsFeed = getOpenFundsFeed(this.onFundUpdate);
  }

  componentWillUnmount() {
    if (this.getOpenFundsFeed) this.getOpenFundsFeed.off();
  }

  onFundUpdate = funds => {
    const managerFunds = funds.filter(fund => fund.managerId === this.props.manager.id);
    this.setState({ managerFunds });
  }

  endWagering = () => {
    this.setState({ wagering: false, fundToWager: null, fade: null });
  }

  onButtonClick = (fundToWager) => {
    return (e) => {
      e.stopPropagation();
      const wagering = true;
      const fade = e.target.id === 'bet-against';
      this.setState({ wagering, fundToWager, fade })  
    }
  }

  render() {
    if (
      !this.state ||
      !this.state.longFade
    )
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    const manager = this.props.manager;
    const { longFade, bias, streak, history, total, managerFunds } = this.state;

    return (
      <V0MuiThemeProvider
        muiTheme={gMuiTheme}
      >
        <IntlProvider locale="en">
          <div className="manager-profile-wrapper">
            <Avatar
              width={160}
              userName={manager.name}
              userAvatar={manager.avatarUrl}
              key={manager.avatarUrl}
              isManager
            />
            <div className="manager-profile-name">
              {this.props.manager.name}
            </div>

            <Card style={{ maxWidth: 544, margin: "0 auto", padding: "12px 48px" }}>
              <div className="manager-card-title">
                {`Specialty: ${manager.details.specialty}`}
              </div>
              <div className="manager-card-summary">
                {manager.details.summary}
              </div>
              <div className="manager-card-follow">
                FOLLOW +
              </div>
              <div className="manager-card-followers">
                0 Followers
              </div>
            </Card>
            <Card style={{ width: "100%", margin: "32px 0" }}>
              <div className="manager-card-stats-wrapper">
                <div className="manager-card-stats-title">
                  {`${manager.name.split(' ')[0]}'s Stats`}
                </div>
                <Divider style={{ position: "absolute", width: "100%", left: 0 }} />
                <div className="manager-stat-row">
                  <div className="manager-stat-field">
                    <div className="manager-field-title">FAN SUPPORT</div>
                    <div className="manager-stat-progress">
                      <LinearProgress
                        style={{ ...linearStyle, backgroundColor: "rgb(213,0,0)"}}
                        mode="determinate"
                        value={(longFade.long || 0) / ((longFade.long + longFade.fade) || 1) * 100}
                      />
                    </div>
                    <div className="manager-stat-sub">
                      <div>
                        <FormattedNumber
                          style="percent"
                          currency="USD"
                          value={(longFade.long || 0) / ((longFade.long + longFade.fade) || 1)}
                        /> of fans bet with {manager.name.split(' ')[0]}
                      </div>
                      <div>
                      <FormattedNumber
                          style="percent"
                          currency="USD"
                          value={(longFade.fade || 0) / ((longFade.long + longFade.fade) || 1)}
                        /> of fans faded against {manager.name.split(' ')[0]}
                      </div>
                    </div>
                    <Divider />
                  </div>
                  <div className="manager-stat-field">
                    <div className="manager-field-title">TEAM BIAS</div>
                    <div className="manager-stat-progress">
                      <LinearProgress
                        style={!bias.home && !bias.away ? greyLinearStyle : linearStyle}
                        mode="determinate"
                        value={(bias.home || 0) / ((longFade.home + longFade.away) || 1) * 100}
                      />
                    </div>
                    <div className="manager-stat-sub">
                      {bias.home || bias.away ? (
                        <React.Fragment>
                          <div>
                            <FormattedNumber
                              style="percent"
                              currency="USD"
                              value={(bias.home || 0) / ((longFade.home + longFade.away) || 1) * 100}
                            /> of fans bet with {manager.name.split(' ')[0]}
                          </div>
                          <div>
                            <FormattedNumber
                                style="percent"
                                currency="USD"
                                value={(bias.away || 0) / ((longFade.home + longFade.away) || 1) * 100}
                              /> of fans bet with {manager.name.split(' ')[0]}
                          </div>
                        </React.Fragment>)
                      : <div>Not enough bets with selections have been placed.</div>}
                    </div>
                    <Divider />
                  </div>
                </div>
                <div className="manager-stat-row">
                    <div className="manager-stat-field">
                      <div className="manager-field-title">LAST TEN BETS</div>
                      <div className="manager-stat-last-ten">
                        {streak.map(s => <img src={s === 'W' ? win : lose} alt={s} />)}
                      </div>
                      <Divider />
                    </div>
                    <div className="manager-stat-field">
                      <div className="manager-field-title">LIFE TIME RECORD</div>
                      <div className="manager-life-time-record">
                        {(history.win || 0) + ' / ' + (history.total)}
                      </div>
                      <Divider />
                    </div>
                  </div>
                  <div className="manager-stat-row">
                    <div className="manager-stat-field">
                      <div className="manager-field-title">TOTAL WAGERED</div>
                      <div className="manager-total-wagered">
                        <FormattedNumber
                          style={"currency"}
                          currency="USD"
                          minimumFractionDigits={0}
                          value={total / 100}
                        />
                      </div>
                      <Divider className="last-divider" />
                    </div>
                    <div className="manager-stat-field">
                      <div className="manager-field-title">DATE JOINED</div>
                      <div className="manager-total-wagered">
                        <Moment
                          locale="en"
                          date={manager.joinTimeMillis}
                          format="MM/DD/YYYY"
                        />
                      </div>
                    </div>
                  </div>
              </div>
            </Card>
            <div className="active-pools-title">
              Active Pools
            </div>
            <Divider />
            <div className="manager-profile-pools">
              {managerFunds && managerFunds.map(fund => <LobbyCard fund={fund} user={this.props.user} onClick={this.onButtonClick} />)}
            </div>
            {this.state.fundToWager &&
              <WagerDialogContainer
                user={this.props.user}
                fund={this.state.fundToWager}
                open={this.state.wagering}
                endWagering={this.endWagering}
                size={this.props.size}
                fade={this.state.fade}
              />}
          </div>
        </IntlProvider>
      </V0MuiThemeProvider>
    );
  }
}
