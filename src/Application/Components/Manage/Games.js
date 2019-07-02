// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import groupBy from "lodash/groupBy";
import moment from "moment";
import Game from "./Game";
import Fund from "../../Models/Fund";
import User from "../../Models/User";

type GamesProps = {
  fund: Fund,
  user: User,
  userCurrent: number,
  userWager: number,
  size: number
};

export default class Games extends Component<GamesProps> {
  constructor(props) {
    super(props);
    this.getGameTime = this.getGameTime.bind(this);
    this.gameTimes = [];
    this.state = {};
    if (props.fund.games) {
      this.gameComponents = this.renderGames(
        Object.keys(this.props.fund.games),
        true
      );
    }
  }

  getGameTime(game, num) {
    this.gameTimes.splice(num, 0, game);
    if (this.gameTimes.length === Object.keys(this.props.fund.games).length) {
      this.setState({ gameTimes: this.gameTimes });
    }
  }

  renderGames(games, sendBack) {
    return games.map((game, index) => (
      <Game
        key={index}
        sendBack={sendBack}
        num={index}
        sendGameTime={this.getGameTime}
        size={this.props.size}
        game={game}
        userCurrent={this.props.userCurrent}
        userWager={this.props.userWager}
        user={this.props.user}
        league={this.props.fund.games[game]}
        fund={this.props.fund}
      />
    ));
  }

  render() {
    const noGames = { textAlign: "center", padding: 10 };
    const dateStyle = {
      color: "grey",
      marginTop: 16
    };

    let gameGrouped = [];
    if (this.state.gameTimes) {
      this.gameTimes = this.gameTimes.sort(
        (a, b) => b.scheduledTimeUnix - a.scheduledTimeUnix
      );
      gameGrouped = groupBy(this.gameTimes, result =>
        moment(result.scheduledTimeUnix).format("MM/DD/YYYY")
      );
    }

    return (
      <div className="tabContent">
        {this.props.fund.games ? (
          gameGrouped.length === 0 ? (
            this.gameComponents
          ) : (
            Object.keys(gameGrouped).map((key, index) => {
              const gamesGrouped = gameGrouped[key].map(g => g.id);
              return (
                <div key={index} style={{ backgroundColor: "#f8f6fc" }}>
                  <div style={dateStyle}>
                    {moment(key)
                      .format("MMM DD")
                      .toUpperCase()}
                  </div>
                  {this.renderGames(gamesGrouped, false)}
                </div>
              );
            })
          )
        ) : (
          <h2 style={noGames}>No games have been wagered on yet</h2>
        )}
        {this.props.fund.status === "RETURNED" ? null : (
          <div style={{ height: 96 }} />
        )}
      </div>
    );
  }
}
