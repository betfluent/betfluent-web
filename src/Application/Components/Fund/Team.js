// @flow
/* eslint-disable */

import React, { Component } from "react";
import { getTeamFeed } from "../../Services/DbService";

type TeamProps = {
  team: {},
  game: Game,
  noName: boolean,
  iconSize: number
};

export default class Team extends Component<TeamProps> {
  static defaultProps = {
    iconSize: 40
  };

  constructor(props) {
    super(props);
    this.league = props.game.league;
    this.teamId = props.team;
    this.onTeamChange = this.onTeamChange.bind(this);
  }

  componentDidMount() {
    this.teamFeed = getTeamFeed(this.league, this.teamId, this.onTeamChange);
  }

  componentWillUnmount() {
    if (this.teamFeed) this.teamFeed.off();
  }

  onTeamChange(team) {
    this.setState({ team });
  }

  render() {
    if (!this.state || !this.state.team) return null;

    const renderFontSize = () => {
      const abbrLength = this.state.team.abbr.length;
      const maxSize = this.props.iconSize < 32 ? 10 : 12;
      return Math.min(this.props.iconSize / abbrLength + 1, maxSize);
    };

    const blankStyle = {
      width: this.props.iconSize,
      height: this.props.iconSize,
      borderRadius: this.props.iconSize / 2,
      backgroundColor: this.state.team.color
        ? this.state.team.color
        : "rgba(0,0,0,.67)",
      color: "#fff",
      fontWeight: 500,
      display: "inline-block",
      verticalAlign: "middle",
      lineHeight: `${this.props.iconSize}px`,
      fontSize: renderFontSize(),
      textAlign: "center",
      marginBottom: this.props.noName ? 0 : 4
    };

    const renderTeamName = () => {
      if (
        this.props.game.league === "NBA" ||
        this.props.game.league === "FIFA"
      ) {
        return <span>{this.state.team.abbr}</span>;
      }

      if (
        this.props.game.league === "MLB" ||
        this.props.game.league === "NFL"
      ) {
        return <span>{this.state.team.name}</span>;
      }
      return null;
    };

    if (this.state.team.avatarUrl) {
      return (
        <div>
          <img
            alt={this.state.team.name}
            src={this.state.team.avatarUrl}
            width={this.props.iconSize}
            style={{
              marginBottom: this.props.noName ? 0 : 4
            }}
          />
          {this.props.noName ? null : (
            <div style={{ marginTop: 0, fontSize: 12 }}>{renderTeamName()}</div>
          )}
        </div>
      );
    }

    return (
      <div>
        <span style={blankStyle}>{this.state.team.abbr}</span>
        {this.props.noName ? null : (
          <div style={{ marginTop: 0, fontSize: 12 }}>{renderTeamName()}</div>
        )}
      </div>
    );
  }
}
