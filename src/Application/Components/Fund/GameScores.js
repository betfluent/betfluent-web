// @flow

import React, { Component } from "react";
import Divider from "material-ui/Divider";
import { gMuiTheme } from "../Styles";

const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const desktopBreakPoint = gMuiTheme.palette.desktopBreakPoint;

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
  },
  size: number
};

export default class GameScores extends Component<GameScoreProps> {
  renderNetworks = game => {
    if (game.league === "FIFA") {
      return (
        <div className="networksInfo" style={{ color: textColor3 }}>
          <Divider style={{ marginTop: 12, marginBottom: 16 }} />
          Live from
          <span style={{ color: textColor2 }}> Russia</span>
        </div>
      );
    }
    return (
      <div className="networksInfo" style={{ color: textColor3 }}>
        <Divider style={{ marginTop: 12, marginBottom: 16 }} />
        Watch on:{" "}
        <span style={{ color: textColor2 }}> {game.broadcastNetwork}</span>
      </div>
    );
  };

  renderGameScores = game => {
    const renderTableHeader = () => {
      if (game.league === "MLB") {
        return (
          <tr>
            {game.homeScoring
              .slice(Math.max(game.homeScoring.length - 9, 0))
              .map((homeScoring, index) => (
                <th key={index}>{homeScoring.period}</th>
              ))}
            <th>R</th>
            <th>H</th>
            <th>E</th>
          </tr>
        );
      }
      return (
        <tr>
          {game.homeScoring.map((homeScoring, index) => (
            <th key={index}>{homeScoring.period}</th>
          ))}
          <th>T</th>
        </tr>
      );
    };

    const renderHomeScoring = () => {
      const gameHomeScoring = game.homeScoring.slice(
        Math.max(game.homeScoring.length - 9, 0)
      );
      if (
        game.status === "closed" &&
        gameHomeScoring[8] &&
        gameHomeScoring[8].points < 0
      ) {
        gameHomeScoring.splice(-1, 1, { period: "9", points: "x" });
      }

      return (
        <tr>
          {gameHomeScoring.map((homeScoring, index) => {
            if (homeScoring.points > -1 || homeScoring.points === "x") {
              return <td key={index}>{homeScoring.points}</td>;
            }
            return <td key={index}>-</td>;
          })}
          <td>{game.homeTeamScore}</td>
          {game.homeTeamHits > -1 ? <td>{game.homeTeamHits}</td> : null}
          {game.homeTeamErrors > -1 ? <td>{game.homeTeamErrors}</td> : null}
        </tr>
      );
    };

    if (game.homeScoring) {
      return (
        <table>
          <tbody>
            {renderTableHeader()}
            <tr>
              {game.awayScoring
                .slice(Math.max(game.awayScoring.length - 9, 0))
                .map((awayScoring, index) => {
                  if (awayScoring.points > -1) {
                    return <td key={index}>{awayScoring.points}</td>;
                  }
                  return <td key={index}>-</td>;
                })}
              <td>{game.awayTeamScore}</td>
              {game.awayTeamHits > -1 ? <td>{game.awayTeamHits}</td> : null}
              {game.awayTeamErrors > -1 ? <td>{game.awayTeamErrors}</td> : null}
            </tr>
            {renderHomeScoring()}
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
    } else if (
      game.league === "NBA" ||
      game.league === "NCAAF" ||
      game.league === "NFL"
    ) {
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
              <th>R</th>
              <th>H</th>
              <th>E</th>
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
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (game.league === "FIFA") {
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
    }
    return null;
  };

  render() {
    const game = this.props.game;

    const renderTeamColor = color => {
      if (color) {
        return `3px solid ${color}`;
      }
      return "none";
    };

    const renderTeamName = (league, alias, fullName, name) => {
      if (this.props.size > desktopBreakPoint) {
        return fullName;
      }
      if (league === "MLB") {
        return alias;
      }
      return name;
    };

    return (
      <div className="gameScores">
        {game.status !== "scheduled" && game.status !== "created" ? (
          <div>
            <Divider
              style={{
                marginBottom: 12,
                marginTop: game.league === "NCAAF" ? 16 : 0
              }}
            />
            <div className="teamsInfo">
              <div style={{ color: textColor3 }}>Team</div>
              <div
                style={{
                  borderLeft: renderTeamColor(game.awayTeam.color),
                  paddingLeft: game.awayTeam.color ? 6 : 0,
                  marginTop: 4,
                  lineHeight: "14px"
                }}
              >
                {renderTeamName(
                  game.league,
                  game.awayTeamAlias,
                  game.awayTeamName,
                  game.awayTeam.name
                )}
              </div>
              <div
                style={{
                  borderLeft: renderTeamColor(game.homeTeam.color),
                  paddingLeft: game.homeTeam.color ? 6 : 0,
                  marginTop: 4,
                  lineHeight: "14px"
                }}
              >
                {renderTeamName(
                  game.league,
                  game.homeTeamAlias,
                  game.homeTeamName,
                  game.homeTeam.name
                )}
              </div>
            </div>
            <div className="scoresInfo">{this.renderGameScores(game)}</div>
            <div className="clear" />
          </div>
        ) : (
          this.renderNetworks(game)
        )}
      </div>
    );
  }
}
