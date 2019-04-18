// @flow

import React, { Component } from "react";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { gMuiTheme } from "../Styles";
import Team from "../Fund/Team";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;

type PotentialGamesProps = {
  selectedGames: []
};

export default class PotentialGames extends Component<PotentialGamesProps> {
  constructor(props) {
    super(props);
    this.state = {
      groupedGames: []
    };
  }

  componentDidMount() {
    if (this.props.selectedGames) {
      const selectedGames = this.props.selectedGames.sort(
        (a, b) => a.scheduledTimeUnix - b.scheduledTimeUnix
      );
      const groupedGames = groupBy(selectedGames, game =>
        moment(game.scheduledTimeUnix).format("MM/DD/YY")
      );
      this.setState({ groupedGames });
    }
  }

  render() {
    return (
      <div className="potentialGames">
        {Object.keys(this.state.groupedGames).map(key => (
          <div key={key}>
            <div
              style={{
                color: textColor2,
                textAlign: "left",
                marginTop: 16,
                fontWeight: 500
              }}
            >
              {moment(key).calendar(null, {
                sameDay: "[Today]",
                nextDay: "[Tomorrow]",
                nextWeek: "ddd, MM/DD",
                sameElse: "ddd, MM/DD"
              })}
            </div>
            <table className="selectedGames" style={{ color: textColor1 }}>
              <tbody>
                {this.state.groupedGames[key].map(game => {
                  const awayTeam = game.awayTeam;
                  const homeTeam = game.homeTeam;

                  return (
                    <tr className="selectedGame" key={game.id}>
                      <td>
                        <Team
                          game={game}
                          team={awayTeam.id}
                          noName
                          iconSize={24}
                        />
                      </td>
                      <td>{awayTeam.name}</td>
                      <td>VS</td>
                      <td>{homeTeam.name}</td>
                      <td>
                        <Team
                          game={game}
                          team={homeTeam.id}
                          noName
                          iconSize={24}
                        />
                      </td>
                      <td>{moment(game.scheduledTimeUnix).format("h:mm A")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
}
