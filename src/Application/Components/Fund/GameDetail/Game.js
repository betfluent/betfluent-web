// @flow
/* eslint-disable */

import React, { Component } from "react";
import Moment from "react-moment";
import moment from "moment";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import { Tabs, Tab } from "material-ui/Tabs";
import Divider from "material-ui/Divider";
import groupBy from "lodash/groupBy";
import { getGameFeed, getBets } from "../../../Services/DbService";
import { betsPercentChange } from "../../../utils";
import { appTheme, gMuiTheme } from "../../Styles";
import { mgMuiTheme } from "../../ManagerStyles";
import Team from "../Team";
import Wagers from "./Wagers";
import PlayByPlay from "./PlayByPlay";
import GameScores from "../GameScores";
import NotFound from "../../NotFound";
import MobileTopHeaderContainer from "../../../Containers/MobileTopHeaderContainer";

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

const ordinalSuffix = i => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

const renderPeriod = game => {
  const { league, period } = game;
  if (league === "NCAAMB") {
    if (period < 3) {
      return `${ordinalSuffix(period)} Half`;
    } else if (period === 3) {
      return "OT";
    }
    return `OT ${period - 2}`;
  }

  if (league === "NBA" || league === "NCAAF" || league === "NFL") {
    if (period < 5) {
      return `${ordinalSuffix(period)} QTR`;
    } else if (period === 5) {
      return "OT";
    }
    return `OT ${period - 4}`;
  }

  if (league === "FIFA") {
    if (period < 3) {
      if (game.status === "stoppage_time") {
        return "ET";
      }
      return `${ordinalSuffix(period)} Half`;
    } else if (period === 3) {
      return "OT";
    }
    return "PKs";
  }

  return null;
};

type GameProps = {
  fund: Fund,
  gameId: string,
  size: number,
  history: {
    goBack: () => {}
  },
  league: string,
  isManager: boolean,
  user: User,
  userWager: number,
  location: {},
  sendHeader: () => void,
  sendContainer: () => void,
  sendCollapsed: () => void,
  scrollBack: () => void
};

export default class Game extends Component<GameProps> {
  constructor(props) {
    super(props);
    this.league = props.fund.games[props.gameId];
    this.gameId = props.gameId;
    this.onGameChange = this.onGameChange.bind(this);
    this.setClasses = this.setClasses.bind(this);
    this.navBack = this.navBack.bind(this);
  }

  componentWillMount() {
    this.gameFeed = getGameFeed(this.league, this.gameId, this.onGameChange);
    if (this.props.fund.wagers) {
      const betKeys = Object.keys(this.props.fund.wagers);
      getBets(betKeys).then(bets => {
        const groupedBets = groupBy(bets, bet => (bet ? bet.gameId : null));
        const gameBets = groupedBets[this.gameId];
        const returnPct = betsPercentChange(gameBets);
        let resultWin = null;
        if (returnPct === 0) {
          resultWin = "push";
        } else if (returnPct > 0) {
          resultWin = "win";
        } else {
          resultWin = "lose";
        }
        this.setState({ gameBets, returnPct, resultWin });
      });
    }
  }

  componentDidMount() {
    if (!this.classesSet) this.setClasses();
    if (
      this.betScroll &&
      this.playScroll &&
      this.gameDetail &&
      this.gameShort &&
      !this.listenerActivated
    ) {
      this.listenerActivated = true;
      this.props.sendContainer(this.betScroll);
      this.props.sendContainer(this.playScroll);
      this.props.sendHeader(this.gameDetail);
      this.props.sendCollapsed(this.gameShort);
    }
  }

  componentDidUpdate() {
    if (!this.classesSet) this.setClasses();
    if (this.state && this.state.oldGame && this.state.game) {
      const oldAwayTeamScore = this.state.oldGame.awayTeamScore;
      const newAwayTeamScore = this.state.game.awayTeamScore;
      const oldHomeTeamScore = this.state.oldGame.homeTeamScore;
      const newHomeTeamScore = this.state.game.homeTeamScore;
      const gameStatus = this.state.game.status;
      if (this.awayScore && this.homeScore) {
        if (gameStatus === "inprogress") {
          if (oldAwayTeamScore !== newAwayTeamScore) {
            this.awayScore.style.color = themeColor;
            this.awayScore.style.fontSize = "18px";
          }
          if (oldHomeTeamScore !== newHomeTeamScore) {
            this.homeScore.style.color = themeColor;
            this.homeScore.style.fontSize = "18px";
          }
          setTimeout(() => {
            this.awayScore.style.color = textColor1;
            this.awayScore.style.fontSize = "16px";
            this.homeScore.style.color = textColor1;
            this.homeScore.style.fontSize = "16px";
          }, 700);
        }
      }
    }
    if (
      this.betScroll &&
      this.playScroll &&
      this.gameDetail &&
      this.gameShort &&
      !this.listenerActivated
    ) {
      this.listenerActivated = true;
      this.props.sendContainer(this.betScroll);
      this.props.sendContainer(this.playScroll);
      this.props.sendHeader(this.gameDetail);
      this.props.sendCollapsed(this.gameShort);
    }
  }

  componentWillUnmount() {
    if (this.gameFeed) this.gameFeed.off();
  }

  onGameChange(game) {
    if (this.state) {
      const oldGame = this.state.game;
      this.setState({ oldGame });
    }
    this.setState({ game });
  }

  setClasses() {
    const tabDiv = document.getElementById("GameDetail");
    if (tabDiv) {
      const innerDiv = tabDiv.childNodes[0];
      if (innerDiv) {
        const tabTitle = innerDiv.childNodes[0];
        const tabInk = innerDiv.childNodes[1];
        if (tabTitle && tabInk) {
          this.classesSet = true;
          const tabWrapper = document.createElement("div");
          tabTitle.parentNode.insertBefore(tabWrapper, tabTitle);
          tabWrapper.appendChild(tabTitle);
          tabInk.parentNode.insertBefore(tabWrapper, tabInk);
          tabWrapper.appendChild(tabInk);
          tabWrapper.classList.add("content");
          tabTitle.style.margin = "0 auto";
          tabInk.style.margin = "0 auto";
        }
      }
    }
    let buttonDiv = document.getElementById("BetDetail");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
    buttonDiv = document.getElementById("GamePlays");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
  }

  navBack() {
    this.props.history.goBack();
  }

  renderStartTime = game => {
    if (
      game.status === "scheduled" ||
      game.status === "created" ||
      game.status === "postponed"
    ) {
      if (
        moment(new Date()).format("YYYY-MM-DD") ===
        moment(game.scheduledTimeUnix).format("YYYY-MM-DD")
      ) {
        return (
          <span>Today, {moment(game.scheduledTimeUnix).format("h:mm A")}</span>
        );
      }
      return (
        <span>{moment(game.scheduledTimeUnix).format("dddd, h:mm A")}</span>
      );
    }
    return null;
  };

  renderBaseBallScore = game => {
    let gamePeriod;
    if (game.homeScoring) {
      if (game.homeScoring[game.period - 1].points === -1) {
        gamePeriod = `Top ${ordinalSuffix(game.period)}`;
      } else if (game.homeScoring[game.period - 1].points > -1) {
        gamePeriod = `Bottom ${ordinalSuffix(game.period)}`;
      }
      return (
        <div style={{ fontSize: 12, lineHeight: "16px" }}>
          <div>{gamePeriod}</div>
          <div
            style={{
              width: 80,
              color: textColor2
            }}
            className="flexContainer"
          >
            <span>B: {game.count.balls}</span>
            <span>S: {game.count.strikes}</span>
            <span>O: {game.count.outs}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  renderBaseColor = (game, base) => {
    let top;
    if (game.homeScoring && game.homeScoring[game.period - 1].points === -1) {
      top = true;
    }
    if (game.homeScoring && game.homeScoring[game.period - 1].points > -1) {
      top = false;
    }
    if (base) {
      if (top) {
        return game.awayTeam.color;
      }
      return game.homeTeam.color;
    }
    return textColor3;
  };

  renderClock = game => {
    if (game.status === "halftime") {
      return "Halftime";
    }
    if (game.status === "complete" || game.status === "closed") {
      return "FINAL";
    }
    if (
      game.status === "scheduled" ||
      game.status === "created" ||
      game.status === "postponed"
    ) {
      return null;
    }

    if (this.props.league === "MLB") {
      return (
        <div>
           <div
             style={{
               position: "relative",
               display: "flex",
               height: 32,
               width: 45,
               margin: "0 auto"
             }}
           >
             <div
               style={{
                 position: "absolute",
                 left: 6,
                 top: 14,
                 width: 12,
                 height: 12,
                 transform: "rotate(45deg)",
                 backgroundColor: this.renderBaseColor(game, game.bases.third)
               }}
             />
             <div
               style={{
                 position: "absolute",
                 left: 16,
                 top: 4,
                 width: 12,
                 height: 12,
                 transform: "rotate(45deg)",
                 backgroundColor: this.renderBaseColor(game, game.bases.second)
               }}
             />
             <div
               style={{
                 position: "absolute",
                 left: 26,
                 top: 14,
                 width: 12,
                 height: 12,
                 transform: "rotate(45deg)",
                 backgroundColor: this.renderBaseColor(game, game.bases.first)
               }}
             />
           </div>
           {this.renderBaseBallScore(game)}
        </div>
      );
    }

    // there is no clock during overtime in NCAAF or NFL
    if ((game.league === "NCAAF" || game.league === "NFL") && game.period > 4) {
      return renderPeriod(game);
    }

    return [
      <span key={10} style={{ fontWeight: 500 }}>
        {game.clock ? game.clock : "0:00"}
      </span>,
      <br key={0} />,
      `${renderPeriod(game)}`
    ];
  };

  renderHeight(game) {
    if (this.props.size > mobileBreakPoint) {
      if (game.status === "scheduled") {
        return window.innerHeight - 230;
      } else if (game.status === "closed" || game.status === "complete") {
        return window.innerHeight - 290;
      }
      return window.innerHeight - 320;
    }
    if (game.status === "scheduled") {
      return window.innerHeight - 305;
    } else if (game.status === "closed" || game.status === "complete") {
      return window.innerHeight - 335;
    }
    return window.innerHeight - 370;
  }

  renderStartTime = game => {
    if (
      game.status === "scheduled" ||
      game.status === "created" ||
      game.status === "postponed"
    ) {
      if (
        moment(new Date()).format("YYYY-MM-DD") ===
        moment(game.scheduledTimeUnix).format("YYYY-MM-DD")
      ) {
        return (
          <span>Today, {moment(game.scheduledTimeUnix).format("h:mm A")}</span>
        );
      }
      return (
        <span>{moment(game.scheduledTimeUnix).format("dddd, h:mm A")}</span>
      );
    }
    return null;
  };

  render() {
    if (!this.state || this.state.game === undefined) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }
    if (this.state.game === null) return <NotFound />;

    const game = this.state.game;
    const status = game.status;

    const wrapperStyle = {
      textAlign: "center",
      alignItems: "center"
    };

    const scoreStyle = {
      fontSize: 16,
      lineHeight: "16px",
      fontWeight: 500,
      width: game.league === "MLB" ? 24 : 32
    };

    const teamIconStyle = {
      width: "24%"
    };

    const clockStyle = {
      fontSize: 12
    };

    const timeStyle = {
      float: "right",
      color: textColor3,
      fontSize: 12,
      lineHeight: "16px"
    };

    const tabBarStyle = {
      height: "48px"
    };

    const containerStyle = {
      overflowY: "scroll",
      maxHeight: this.renderHeight(game),
      paddingBottom: 24,
      boxSizing: "border-box"
    };

    const renderColor = () => {
      if (this.state.resultWin === "push") {
        return textColor1;
      }
      if (this.state.resultWin === "win") {
        return themeColor;
      }
      return alertColor;
    };

    const renderArrow = () => {
      if (this.state.resultWin !== "push") {
        if (this.state.resultWin === "win") {
          return "▲";
        }
        return "▼";
      }
      return null;
    };

    const renderReturnPct = () => {
      if (status === "closed" || status === "complete") {
        return (
          <span
            style={{
              fontSize: 12,
              lineHeight: "16px",
              float: "left",
              color: renderColor()
            }}
          >
            <span
              style={{
                fontSize: 6,
                padding: 4,
                position: "relative",
                top: -2
              }}
            >
              {renderArrow()}
            </span>
            {Math.abs(this.state.returnPct)}%
          </span>
        );
      }
      return (
        <span
          style={{
            fontSize: 12,
            lineHeight: "16px",
            float: "left",
            color: themeColor
          }}
        >
          LIVE
        </span>
      );
    };

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div style={{ position: "relative" }}>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
          <div className="GameDetails">
            <div className="contentHeader GameHeader">
              <div style={{ height: 16, marginBottom: 16 }}>
                {this.props.size > mobileBreakPoint ? (
                  <div style={{ height: "24px" }}>
                    <NavigationArrowBack
                      className="navbackArrow"
                      onClick={this.navBack}
                    />
                    <div className="clear" />
                  </div>
                ) : (
                  renderReturnPct()
                )}

                <span
                  ref={el => {
                    this.gameShort = el;
                  }}
                  style={{
                    transition: "all 0.3s ease-in-out",
                    opacity: 0,
                    fontSize: 14,
                    lineHeight: "16px",
                    fontWeight: 500
                  }}
                >
                  {game.awayTeamAlias} @ {game.homeTeamAlias}
                </span>
                <span style={timeStyle}>
                  <Moment
                    format="ddd, MMM DD @ h:mm A"
                    date={game.scheduledTimeUnix}
                  />
                </span>
              </div>
              <div
                style={{
                  transition: "all 0.3s ease-in-out",
                  height:
                    game.status !== "scheduled" && game.status !== "created"
                      ? 136
                      : 108,
                  overflowY: "hidden",
                  width: "100%"
                }}
                ref={el => {
                  this.gameDetail = el;
                }}
              >
                <div style={wrapperStyle} className="flexContainer">
                  <span style={teamIconStyle}>
                    <Team
                      game={game}
                      team={game.awayTeamId}
                      size={this.props.size}
                    />
                  </span>
                  {game.awayTeamScore !== undefined ? (
                    <span
                      style={scoreStyle}
                      ref={awayScore => {
                        this.awayScore = awayScore;
                      }}
                    >
                      {game.awayTeamScore}
                    </span>
                  ) : null}
                  <span style={clockStyle}>
                    <span style={{ fontSize: 14 }}>
                      {this.renderClock(game)}
                    </span>
                    <div style={{ color: textColor2 }}>
                      {this.renderStartTime(game)}
                    </div>
                  </span>
                  {game.homeTeamScore !== undefined ? (
                    <span
                      style={scoreStyle}
                      ref={homeScore => {
                        this.homeScore = homeScore;
                      }}
                    >
                      {game.homeTeamScore}
                    </span>
                  ) : null}
                  <span style={teamIconStyle}>
                    <Team
                      game={game}
                      team={game.homeTeamId}
                      size={this.props.size}
                    />
                  </span>
                </div>

                {game.league === "NCAAF" || game.league === "NFL" ? (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      marginTop: -8,
                      height: 14,
                      lineHeight: "14px"
                    }}
                  >
                    {game.situationSummary()}
                  </div>
                ) : null}

                <GameScores game={game} size={this.props.size} />
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: 0 }} />
          <div className="FillEdges" />
          <div id="GameDetail">
            <Tabs
              inkBarStyle={{
                background: this.props.isManager
                  ? managerThemeColor
                  : themeColor
              }}
              tabItemContainerStyle={tabBarStyle}
            >
              <Tab
                label="GAME BETS"
                id="BetDetail"
                onActive={() => this.props.scrollBack(this.betScroll)}
              >
                <div
                  style={containerStyle}
                  ref={el => {
                    this.betScroll = el;
                  }}
                >
                  <div className="contentHeader">
                    <Wagers
                      size={this.props.size}
                      game={game}
                      fund={this.props.fund}
                      userWager={this.props.userWager}
                      user={this.props.user}
                      location={this.props.location}
                    />
                  </div>
                </div>
              </Tab>
              {/* game.league !== "FIFA" ? (
                <Tab
                  label="PLAY-BY-PLAY"
                  id="GamePlays"
                  onActive={() => this.props.scrollBack(this.playScroll)}
                >
                  <div
                    style={containerStyle}
                    ref={el => {
                      this.playScroll = el;
                    }}
                  >
                    <div className="contentHeader">
                      <PlayByPlay
                        size={this.props.size}
                        league={this.league}
                        gameId={this.gameId}
                        gameStatus={status}
                        awayTeamId={game.awayTeam.id}
                        homeTeamId={game.homeTeam.id}
                        awayTeamColor={game.awayTeam.color}
                        homeTeamColor={game.homeTeam.color}
                      />
                    </div>
                  </div>
                </Tab>
              ) : null */}
            </Tabs>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
