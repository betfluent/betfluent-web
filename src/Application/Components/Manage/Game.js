// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { Card } from "material-ui/Card";
import { Link } from "react-router-dom";
import moment from "moment";
import Lottie from "react-lottie";
import { getGameFeed } from "../../Services/DbService";
import { mgMuiTheme } from "../ManagerStyles";
import Team from "../Fund/Team";
import BetDetails from "./BetDetails";
import GameScores from "./GameScores";
import * as spinner from "../../../Assets/spinner.json";

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

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

type GameProps = {
  fund: Fund,
  user: User,
  userWager: number,
  league: string,
  game: string,
  num: number,
  sendBack: boolean,
  sendGameTime: (game: {}, index: number) => void,
  size: number
};

export default class Game extends Component<GameProps> {
  constructor(props) {
    super(props);
    this.league = props.league;
    this.gameId = props.game;
    this.onGameChange = this.onGameChange.bind(this);
  }

  componentDidMount() {
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
    if (this.props.sendBack) {
      this.props.sendGameTime(game, this.props.num);
    }
    this.setState({ game });
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
    return null;
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
    if (this.props.sendBack) return null;

    const game = this.state.game;
    const now = new Date();
    const gameTime = game.scheduledTimeUnix;

    const wrapperStyle = {
      textAlign: "center",
      alignItems: "center",
      color: textColor1
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
      display: "inline-block",
      fontSize: 12,
      lineHeight: "16px",
      padding: "12px 0"
    };

    return (
      <Link to={`./${this.props.fund.id}/${game.id}`}>
        <Card className="GameCard" zDepth={2}>
          <div style={wrapperStyle} className="flexContainer">
            <span style={teamIconStyle}>
              <Team game={game} team={game.awayTeamId} size={this.props.size} />
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
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {this.renderClock(game)}
              </span>
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
              <Team game={game} team={game.homeTeamId} size={this.props.size} />
            </span>
          </div>
          <GameScores game={game} />
          {moment(now).format("YYYY-MM-DD") ===
          moment(gameTime).format("YYYY-MM-DD") ? (
            <BetDetails
              size={this.props.size}
              game={game}
              fund={this.props.fund}
              userWager={this.props.userWager}
              user={this.props.user}
            />
          ) : null}
        </Card>
      </Link>
    );
  }
}
