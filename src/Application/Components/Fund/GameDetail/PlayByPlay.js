// @flow

import React, { Component } from "react";
import groupBy from "lodash/groupBy";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "material-ui/Divider";
import EmptyPlayByPlay from "material-ui/svg-icons/notification/live-tv";
import { getGamePlayByPlayFeed } from "../../../Services/DbService";
import { appTheme, gMuiTheme } from "../../Styles";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;

const dividerStyle = {
  marginTop: 8,
  marginBottom: 8
};

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

  if (league === "NBA" || league === "NCAAF" || league === "NFL") {
    if (period < 5) {
      return `${ordinalSuffix(period)} QTR`;
    } else if (period === 5) {
      return "OT";
    }
    return `OT ${period - 4}`;
  }

  if (league === "MLB") {
    return `${ordinalSuffix(period)} Inning`;
  }
  return null;
};

type PlayByPlaysProps = {
  league: string,
  gameId: string,
  gameStatus: string,
  awayTeamId: string,
  homeTeamId: string,
  awayTeamColor: string,
  homeTeamColor: string
};

export default class PlayByPlays extends Component<PlayByPlaysProps> {
  constructor(props) {
    super(props);
    this.league = props.league;
    this.gameId = props.gameId;
    this.onGamePlayByPlayChange = this.onGamePlayByPlayChange.bind(this);
    this.renderPlayRecordList = this.renderPlayRecordList.bind(this);
    this.renderPlayRecord = this.renderPlayRecord.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.gamePlayByPlayFeed = getGamePlayByPlayFeed(
      this.league,
      this.gameId,
      this.onGamePlayByPlayChange
    );
  }

  componentWillUnmount() {
    if (this.gamePlayByPlayFeed) this.gamePlayByPlayFeed.off();
  }

  onGamePlayByPlayChange(gamePlayByPlay) {
    const sortedGamePlayByPlay = gamePlayByPlay.sort(
      (a, b) => b.sequence - a.sequence
    );
    const groupedGamePlayByPlay = groupBy(
      sortedGamePlayByPlay,
      result => result.period
    );
    this.setState({ gamePlayByPlay: groupedGamePlayByPlay });
  }

  renderPlayRecordList(gamePlayByPlay) {
    const gameStatus = this.props.gameStatus;
    return Object.keys(gamePlayByPlay).map((period, i) => (
      <div key={i}>
        <div style={{ marginTop: 16, fontSize: 14, color: textColor3 }}>
          {`${renderPeriod(this.league, period)}`}
        </div>
        <Divider style={dividerStyle} />
        <div className="pbpItem flexContainer">
          {this.props.league === "MLB" ? null : (
            <div className="pbpClock">TIME</div>
          )}
          <div className="pbpPlay">PLAY</div>
          <div className="pbpScore">SCORE</div>
        </div>
        {gameStatus === "complete" || gameStatus === "closed"
          ? this.renderPlayRecord(period).reverse()
          : this.renderPlayRecord(period)}
      </div>
    ));
  }

  renderTeamColor(teamId) {
    if (teamId === this.props.awayTeamId) {
      return `3px solid ${this.props.awayTeamColor}`;
    } else if (teamId === this.props.homeTeamId) {
      return `3px solid ${this.props.homeTeamColor}`;
    }
    return "3px solid rgba(0,0,0,0)";
  }

  renderPlayRecord(period) {
    return this.state.gamePlayByPlay[period].map((PlayByPlay, index) => (
      <div key={index}>
        <Divider style={dividerStyle} />
        <div
          className="pbpItem flexContainer"
          style={{ fontWeight: PlayByPlay.scoringPlay ? 500 : 400 }}
        >
          {this.props.league === "MLB" ? null : (
            <div className="pbpClock">{PlayByPlay.clock}</div>
          )}
          <div
            className="pbpPlay"
            style={{
              borderLeft: this.renderTeamColor(PlayByPlay.teamId),
              paddingLeft: 8
            }}
          >
            {PlayByPlay.description}
          </div>
          <div
            className="pbpScore"
            style={{ color: PlayByPlay.scoringPlay ? textColor1 : textColor3 }}
          >
            {PlayByPlay.awayTeamScore} - {PlayByPlay.homeTeamScore}
          </div>
        </div>
      </div>
    ));
  }

  render() {
    if (!this.state.gamePlayByPlay) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div style={{ marginTop: 80 }} className="center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    if (Object.keys(this.state.gamePlayByPlay).length === 0) {
      return (
        <div className="emptyPortfolio">
          <EmptyPlayByPlay />
          <p>
            The game is about to start. <br />Check back here for live
            play-by-play action when it does.
          </p>
        </div>
      );
    }

    const gameStatus = this.props.gameStatus;
    return (
      <div className="pbpList" style={{ color: textColor1, fontWeight: 500 }}>
        {gameStatus === "complete" || gameStatus === "closed"
          ? this.renderPlayRecordList(this.state.gamePlayByPlay)
          : this.renderPlayRecordList(this.state.gamePlayByPlay).reverse()}
      </div>
    );
  }
}
