// @flow

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Card } from "material-ui/Card";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import Divider from "material-ui/Divider";
import { getGameFeed, getLatestPlayByPlayFeed } from "../../Services/DbService";
import { appTheme, gMuiTheme } from "../Styles";
import Team from "./Team";
import WagerDetails from "./WagerDetails";
import GameScores from "./GameScores";
import Fund from "../../Models/Fund";
import User from "../../Models/User";
import Bet from "../../Models/Bet";
import { betsPercentChange } from "../../utils";

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

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

type GameProps = {
  fund: Fund,
  user: User,
  userWager: number,
  league: string,
  game: string,
  bets: Bet[],
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
    this.onLatestPlayByPlayChange = this.onLatestPlayByPlayChange.bind(this);
    this.renderLatestPbp = this.renderLatestPbp.bind(this);
  }

  componentDidMount() {
    this.gameFeed = getGameFeed(this.league, this.gameId, this.onGameChange);
    const bets = this.props.bets;
    if (bets) {
      const returnPct = betsPercentChange(bets);
      let resultWin = null;
      if (returnPct === 0) {
        resultWin = "push";
      } else if (returnPct > 0) {
        resultWin = "win";
      } else {
        resultWin = "lose";
      }
      /* eslint-disable-next-line */
      this.setState({ returnPct, resultWin });
    }

    this.latestPlayByPlayFeed = getLatestPlayByPlayFeed(
      this.league,
      this.gameId,
      this.onLatestPlayByPlayChange
    );
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
    if (this.latestPlayByPlay) this.latestPlayByPlay.off();
  }

  onGameChange(game) {
    if (this.state) {
      const oldGame = this.state.game;
      this.setState({ oldGame });
    }
    if (this.props.sendBack) {
      this.props.sendGameTime(game, this.props.num);
    } else {
      this.setState({ game });
    }
  }

  onLatestPlayByPlayChange(latestPlayByPlay) {
    this.setState({ latestPlayByPlay });
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
        {game.clock ? game.clock : "00:00"}
      </span>,
      <br key={0} />,
      `${renderPeriod(game)}`
    ];
  };

  renderTopHeader(game, renderColor, renderArrow) {
    if (game.status !== "complete" && game.status !== "closed") {
      if (game.broadcastNetwork) {
        return (
          <div style={{ color: textColor3 }}>
            Watch on:{" "}
            <span style={{ color: textColor2 }}> {game.broadcastNetwork}</span>
          </div>
        );
      }
      return null;
    }
    return (
      <div>
        <span
          style={{
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
      </div>
    );
  }

  renderTeamColor = (teamId, game) => {
    if (teamId === game.awayTeamId) {
      return `3px solid ${game.awayTeam.color}`;
    } else if (teamId === game.homeTeamId) {
      return `3px solid ${game.homeTeam.color}`;
    }
    return "3px solid rgba(0,0,0,0)";
  };

  renderLatestPbp(game) {
    if (this.state.latestPlayByPlay) {
      const dividerStyle = {
        marginTop: 16,
        marginBottom: 16
      };

      const latestPlayByPlay = this.state.latestPlayByPlay;
      if (
        game.status !== "scheduled" &&
        game.status !== "created" &&
        game.status !== "complete" &&
        game.status !== "closed"
      ) {
        return (
          <div className="latestPbp">
            <Divider style={dividerStyle} />
            <div className="pbpItem flexContainer" style={{ fontWeight: 400 }}>
              <div
                style={{
                  color: textColor3,
                  width: 52,
                  marginRight: 16
                }}
              >
                Last Play:{" "}
              </div>
              <div
                className="pbpPlay"
                style={{
                  borderLeft: this.renderTeamColor(
                    latestPlayByPlay.teamId,
                    game
                  ),
                  paddingLeft: 8
                }}
              >
                {latestPlayByPlay.description}
              </div>
            </div>
          </div>
        );
      }
      return null;
    }
    return null;
  }

  render() {
    if (!this.state || !this.state.game) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div style={{ margin: 32 }} className="center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }
    if (this.props.sendBack) return null;

    const game = this.state.game;
    const now = new Date();
    const gameTime = game.scheduledTimeUnix;
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

    return (
      <Link to={`./${this.props.fund.id}/${game.id}`}>
        <Card className="GameCard" zDepth={2}>
          {status !== "scheduled" && status !== "created" ? (
            <div className="gameTopHeader flexContainer">
              {this.renderTopHeader(game, renderColor, renderArrow)}
              <div style={{ color: textColor3 }}>
                <Moment format="ddd, MMM DD @ h:mm A" date={gameTime} />
                {/* <span style={{color:this.state.resultWin === 'push' ? textColor1 : this.state.resultWin === 'win' ? themeColor : alertColor}}>${Math.abs(this.state.userTotalProfit)}</span> */}
              </div>
            </div>
          ) : null}

          <div style={wrapperStyle} className="flexContainer">
            <span style={teamIconStyle}>
              <Team game={game} team={game.awayTeamId} size={this.props.size} />
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
              <span style={{ fontSize: 14 }}>{this.renderClock(game)}</span>
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
              <Team game={game} team={game.homeTeamId} size={this.props.size} />
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

          {this.renderLatestPbp(game)}

          {moment(now).format("YYYY-MM-DD") ===
          moment(gameTime).format("YYYY-MM-DD") ? (
            <WagerDetails
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
