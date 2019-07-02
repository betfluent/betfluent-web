// @flow
/* eslint-disable */

import React, { Component } from "react";
import Moment from "react-moment";
import moment from "moment";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Lottie from "react-lottie";
import { getGameFeed } from "../../../Services/DbService";
import { mgMuiTheme } from "../../ManagerStyles";
import Team from "../../Fund/Team";
import Bets from "./Bets";
import GameScores from "../GameScores";
import * as spinner from "../../../../Assets/spinner.json";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor2 = mgMuiTheme.palette.textColor2;
const textColor3 = mgMuiTheme.palette.textColor3;
const mobileBreakPoint = mgMuiTheme.palette.mobileBreakPoint;

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

const renderPeriod = (league, period) => {
  if (league === "NCAAMB") {
    if (period < 3) {
      return `${ordinalSuffix(period)} Half`;
    } else if (period === 3) {
      return "OT";
    }
    return `OT ${period - 2}`;
  }

  if (league === "NBA") {
    if (period < 5) {
      return `${ordinalSuffix(period)} QTR`;
    } else if (period === 5) {
      return "OT";
    }
    return `OT ${period - 4}`;
  }
  return null;
};

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

type GameProps = {
  fund: Fund,
  gameId: string,
  size: number,
  history: {
    goBack: () => {},
    push: () => void
  },
  league: string,
  user: User,
  userWager: number
};

export default class Game extends Component<GameProps> {
  constructor(props) {
    super(props);
    this.league = props.fund.games[props.gameId];
    this.gameId = props.gameId;
    this.onGameChange = this.onGameChange.bind(this);
    this.navBack = this.navBack.bind(this);
  }

  componentWillMount() {
    this.gameFeed = getGameFeed(this.league, this.gameId, this.onGameChange);
  }

  componentDidUpdate() {
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

  navBack() {
    this.props.history.push(`/manage/pools/${this.props.fund.id}`);
  }

  static renderStartTime(game) {
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
  }

  renderHeight(game) {
    if (this.props.size > mobileBreakPoint) {
      if (game.status === "scheduled") {
        return window.innerHeight - 250;
      } else if (game.status === "closed" || game.status === "complete") {
        return window.innerHeight - 310;
      }
      return window.innerHeight - 340;
    }
    if (game.status === "scheduled") {
      return window.innerHeight - 335;
    } else if (game.status === "closed" || game.status === "complete") {
      return window.innerHeight - 365;
    }
    return window.innerHeight - 400;
  }

  renderBaseBallStats = game => {
    if (game && game.count) {
      return (
        <div>{`B${game.count.balls} - S${game.count.strikes} - O${
          game.count.outs
        }`}</div>
      );
    }
    return null;
  };

  renderBaseBallScore = game => {
    if (game.homeScoring && game.homeScoring[game.period - 1].points === -1) {
      return (
        <div>
          <div>{`Top ${game.period} ${ordinalSuffix(game.period)}`}</div>
          {this.renderBaseBallStats(game)}
        </div>
      );
    } else if (
      game.homeScoring &&
      game.homeScoring[game.period - 1].points > -1
    ) {
      return (
        <div>
          <div>{`Bottom ${game.period} ${ordinalSuffix(game.period)}`}</div>
          {this.renderBaseBallStats(game)}
        </div>
      );
    }
    return null;
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
              height: "50px",
              width: "50px"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 25,
                width: 15,
                height: 15,
                transform: "rotate(45deg)",
                backgroundColor: game.bases.third ? themeColor : textColor3
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 17,
                top: 12,
                width: 15,
                height: 15,
                transform: "rotate(45deg)",
                backgroundColor: game.bases.second ? themeColor : textColor3
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 25,
                width: 15,
                height: 15,
                transform: "rotate(45deg)",
                backgroundColor: game.bases.first ? themeColor : textColor3
              }}
            />
          </div>
          {this.renderBaseBallScore(game)}
        </div>
      );
    }

    return [
      <span key={10} style={{ fontWeight: 500 }}>
        {game.clock ? game.clock : "00:00"}
      </span>,
      <br key={0} />,
      `${renderPeriod(this.props.league, game.period)}`
    ];
  };

  render() {
    if (!this.state)
      return (
        <div style={{ padding: "8px 0" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );
    if (!this.state.game)
      return (
        <div style={{ padding: "8px 0" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );

    const game = this.state.game;

    const wrapperStyle = {
      textAlign: "center",
      alignItems: "center"
    };

    const scoreStyle = {
      fontSize: 16,
      lineHeight: "16px",
      fontWeight: 500,
      width: 32
    };

    const teamIconStyle = {
      width: "24%"
    };

    const clockStyle = {
      fontSize: 12
    };

    const titleStyle = {
      textAlign: "left",
      fontSize: 20,
      lineHeight: "28px",
      fontWeight: 500,
      color: textColor1
    };

    const timeStyle = {
      textAlign: "left",
      color: textColor3,
      fontSize: 12,
      lineHeight: "16px"
    };

    const containerStyle = {
      overflowY: "scroll",
      maxHeight: this.renderHeight(game)
    };

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <div>
          <div className="GameDetails">
            <div className="contentHeader GameHeader">
              <div>
                <div>
                  <NavigationArrowBack
                    className="navbackArrow"
                    onClick={this.navBack}
                  />
                  <div className="clear" />
                </div>
                <div style={titleStyle}>{game.description}</div>
                <div style={timeStyle}>
                  <Moment
                    format="ddd, MMM DD @ h:mm A"
                    date={game.scheduledTimeUnix}
                  />
                </div>
              </div>
              <div style={wrapperStyle} className="flexContainer">
                <span style={teamIconStyle}>
                  <Team
                    game={game}
                    team={game.awayTeamId}
                    size={this.props.size}
                  />
                </span>
                {game.awayTeamScore ? (
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
                  <span style={{ fontSize: 14 }}>{this.renderClock(game)}</span>
                  <div style={{ color: textColor2 }}>
                    {Game.renderStartTime(game)}
                  </div>
                </span>
                {game.homeTeamScore ? (
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
              <GameScores game={game} />
            </div>
          </div>
          <div style={containerStyle}>
            <div className="contentHeader">
              <Bets
                size={this.props.size}
                game={game}
                fund={this.props.fund}
                userWager={this.props.userWager}
                user={this.props.user}
                history={this.props.history}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
