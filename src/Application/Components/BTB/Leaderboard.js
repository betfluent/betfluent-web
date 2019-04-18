// @flow

import React, { Component } from "react";
import EmptyWork from "material-ui/svg-icons/maps/directions-run";
import { Card } from "material-ui/Card";
import { gMuiTheme } from "../Styles";
import Avatar from "../Avatar";
import PublicUser from "../../Models/PublicUser";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;

type LeaderboardProps = {
  allPublicUsers: [PublicUser]
};

export default class Leaderboard extends Component<LeaderboardProps> {
  constructor(props) {
    super(props);
    this.renderLeaderboard = this.renderLeaderboard.bind(this);
    this.state = {
      allPublicUsers: props.allPublicUsers
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ allPublicUsers: nextProps.allPublicUsers });
  }

  renderLeaderboard() {
    const sortedAllPublicUsers = this.state.allPublicUsers
      .filter(publicUser => publicUser.predictionStats[0].predictionCount > 0)
      .sort(
        (a, b) => b.predictionStats[0].points - a.predictionStats[0].points
      );
    // const topFivePublicUsers = sortedAllPublicUsers.slice(0, 5);

    const renderNumber = number => {
      if (number > 0) {
        return number;
      }
      return 0;
    };

    const renderStreak = number => {
      if (number > 0) {
        return `W${number}`;
      } else if (number < 0) {
        return `L${Math.abs(number)}`;
      }
      return 0;
    };

    return (
      <div className="btbLeaderboard" style={{ color: textColor1 }}>
        <table>
          <tbody>
            <tr style={{ color: textColor3 }}>
              <th>Players</th>
              <th>Record</th>
              <th>Streak</th>
              <th>Points</th>
            </tr>
            {sortedAllPublicUsers.map((publicUser, index) => (
              <tr key={index}>
                <td
                  className="flexContainer"
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <span>{index + 1} </span>
                  <Avatar
                    width={24}
                    userName={publicUser.name}
                    userAvatar={publicUser.avatarUrl}
                  />
                  <span>{publicUser.name}</span>
                </td>
                <td>
                  {renderNumber(publicUser.predictionStats[0].rightCount)} -{" "}
                  {renderNumber(publicUser.predictionStats[0].wrongCount)}
                </td>
                <td>
                  {renderStreak(publicUser.predictionStats[0].currentStreak)}
                </td>
                <td>{renderNumber(publicUser.predictionStats[0].points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    if (!this.state.allPublicUsers || this.state.allPublicUsers === []) {
      return (
        <div className="emptyPortfolio">
          <EmptyWork />
          <p>No current participants.</p>
        </div>
      );
    }
    return (
      <div className="tabContent">
        <div style={{ color: textColor2, fontWeight: 500 }}>
          Beat the Bettor{" "}
          <span style={{ color: textColor3, fontWeight: 400 }}>
            (Current Week)
          </span>
        </div>
        <Card zDepth={2} className="leaderBoardCards">
          {this.renderLeaderboard()}
        </Card>
      </div>
    );
  }
}
