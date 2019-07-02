// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import Divider from "material-ui/Divider";
import { mgMuiTheme } from "../ManagerStyles";

const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;

type GameScoreProps = {
  game: {
    homeTeamName: string,
    homeTeamScore: number,
    homeScoring: {
      period: string,
      points: number
    }[],
    awayTeamName: string,
    awayTeamScore: number,
    awayScoring: {
      period: string,
      points: number
    }[]
  }
};

export default class GameScores extends Component<GameScoreProps> {
  static renderNetworks(game) {
    if (game.status !== "complete" && game.status !== "closed") {
      return (
        <div className="networksInfo" style={{ color: textColor3 }}>
          <Divider style={{ marginTop: 12, marginBottom: 16 }} />
          Watch on:{" "}
          <span style={{ color: textColor1 }}> {game.broadcastNetwork}</span>
        </div>
      );
    }
    return null;
  }

  static renderGameScores(game) {
    if (game.homeScoring) {
      return (
        <table>
          <tbody>
            <tr>
              {game.homeScoring.map((homeScoring, index) => (
                <th key={index}>{homeScoring.period}</th>
              ))}
              <th>T</th>
            </tr>
            <tr>
              {game.awayScoring.map((awayScoring, index) => {
                if (awayScoring.points > -1) {
                  return <td key={index}>{awayScoring.points}</td>;
                }
                return <td key={index}>-</td>;
              })}
              <td>{game.awayTeamScore}</td>
            </tr>
            <tr>
              {game.homeScoring.map((homeScoring, index) => {
                if (homeScoring.points > -1) {
                  return <td key={index}>{homeScoring.points}</td>;
                }
                return <td key={index}>-</td>;
              })}
              <td>{game.homeTeamScore}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    if (game.league === "NCAAMB") {
      return (
        <table>
          <tbody>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>T</th>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (game.league === "NBA") {
      return (
        <table>
          <tbody>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>T</th>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (game.league === "MLB") {
      return (
        <table>
          <tbody>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>T</th>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return null;
  }

  render() {
    const game = this.props.game;

    return (
      <div className="gameScores">
        {game.status !== "scheduled" ? (
          <div>
            <Divider style={{ marginBottom: 16 }} />
            <div className="teamsInfo">
              <div style={{ color: textColor3 }}>Team</div>
              <div>{game.awayTeamName}</div>
              <div>{game.homeTeamName}</div>
            </div>
            <div className="scoresInfo">
              {GameScores.renderGameScores(game)}
            </div>
            <div className="clear" />
          </div>
        ) : null}
        {GameScores.renderNetworks(game)}
      </div>
    );
  }
}
