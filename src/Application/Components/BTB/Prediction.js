// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from "material-ui/Card";
import ThumbUp from "material-ui/svg-icons/action/thumb-up";
import ThumbDown from "material-ui/svg-icons/action/thumb-down";
import { gMuiTheme } from "../Styles";
import Manager from "../../Models/Manager";
import Game from "../../Models/Game";
import Bet from "../../Models/Bet";
import Avatar from "../Avatar";
import Team from "../Fund/Team";

type PredictionProps = {
  manager: Manager,
  game: Game,
  bet: Bet,
  prediction: {
    willWin: boolean
  },
  size: number
};

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const alertColor = gMuiTheme.palette.alertColor;
const themeColorLight = gMuiTheme.raisedButton.disabledColor;

export default class Prediction extends Component<PredictionProps> {
  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    const willWin = this.props.prediction.willWin;
    const bet = this.props.bet;
    const game = this.props.game;
    const manager = this.props.manager;
    let result;

    const wrapperStyle = {
      textAlign: "center",
      alignItems: "center",
      margin: "16px auto",
      width: "80%"
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

    const pointsStyle = {
      lineHeight: "20px",
      fontWeight: 500
    };

    const pointsUnitStyle = {
      fontSize: 12
    };

    const titleStyle = {
      fontSize: 14,
      lineHeight: "16px"
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "14px",
      fontWeight: 300
    };

    const renderBorderTop = () => {
      if (bet.type !== "OVER_UNDER") {
        if (bet.selectionId === game.awayTeamId) {
          if (game.awayTeam.color) {
            return `48px solid ${game.awayTeam.color}`;
          }
          return `48px solid ${textColor1}`;
        }
        if (game.homeTeam.color) {
          return `48px solid ${game.homeTeam.color}`;
        }
        return `48px solid ${textColor1}`;
      }
      return `48px solid ${themeColorLight}`;
    };

    const renderGameStatus = status => {
      if (status === "scheduled" || status === "created") {
        return "Waiting to start";
      } else if (status === "complete" || status === "closed") {
        return "Final";
      }
      return "In Progress";
    };

    const renderPoints = prediction => {
      if (prediction.outcome === "RIGHT") {
        result = "And were correct";
        return (
          <span
            key={0}
            style={{
              ...pointsStyle,
              fontSize: 20,
              color: themeColor
            }}
          >
            {prediction.points}
            <span style={pointsUnitStyle}> pts</span>
          </span>
        );
      }
      if (prediction.outcome === "WRONG") {
        result = "And were wrong";
        return (
          <span
            key={0}
            style={{
              ...pointsStyle,
              fontSize: 16,
              color: alertColor
            }}
          >
            WRONG
          </span>
        );
      }
      if (prediction.outcome === "PUSH") {
        result = "And bet pushed";
        return (
          <span
            key={0}
            style={{
              ...pointsStyle,
              fontSize: 16,
              color: textColor1
            }}
          >
            PUSH
          </span>
        );
      }

      result = "Outcome pending";
      return null;
    };

    return (
      <Link to={`/pools/${bet.fundId}/${bet.gameId}`}>
        <Card className="PredictionCard" zDepth={2}>
          <div className="flexContainer">
            <div
              className="predictionMgInfoContainer"
              style={{ borderTop: renderBorderTop() }}
            >
              {manager ? (
                <div className="predictionMgInfo flexContainer">
                  <Avatar
                    width={48}
                    userName={manager.name}
                    userAvatar={manager.avatarUrl}
                    isManager
                  />
                  <span>
                    <div
                      style={{
                        ...titleStyle,
                        width: this.props.size < 340 ? 166 : "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {bet.summary()}
                    </div>
                    <div style={subtitleStyle}>{manager.name}</div>
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div style={wrapperStyle} className="flexContainer">
            <span style={teamIconStyle}>
              <Team game={game} team={game.awayTeamId} noName />
            </span>
            {game.awayTeamScore !== undefined ? (
              <span style={scoreStyle}>{game.awayTeamScore}</span>
            ) : null}
            <span style={{ fontSize: 12 }}>
              {renderGameStatus(game.status)}
            </span>
            {game.homeTeamScore !== undefined ? (
              <span style={scoreStyle}>{game.homeTeamScore}</span>
            ) : null}
            <span style={teamIconStyle}>
              <Team game={game} team={game.homeTeamId} noName />
            </span>
          </div>

          <div className="flexContainer">
            <div className="predictionPoints">
              {renderPoints(this.props.prediction)}
            </div>
            <div className="predictionThumbContainer">
              <span style={{ textAlign: "right" }}>
                <div style={titleStyle}>
                  {willWin ? "You Agreed" : "You Disagreed"}
                </div>
                <div style={subtitleStyle}>{result}</div>
              </span>
              <div className="predictionThumb">
                {willWin ? (
                  <ThumbUp style={{ color: themeColor }} />
                ) : (
                  <ThumbDown style={{ color: themeColor }} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
}
