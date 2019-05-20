// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import groupBy from "lodash/groupBy";
import moment from "moment";
import Game from "./Game";
import { getBets } from "../../Services/DbService";

type GamesProps = {
  fund: Fund
};

export default class Games extends Component<GamesProps> {
  constructor(props) {
    super(props);
    this.getGameTime = this.getGameTime.bind(this);
    this.gameTimes = [];
    this.state = {
      groupedBets: {}
    };
  }

  componentWillMount() {
    this.setupGames(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.fund, this.props.fund)) {
      this.gameTimes = [];
      this.setupGames(nextProps);
    }
  }

  setupGames = props => {
    if (props.fund.games) {
      this.gameComponents = this.renderGames(
        props,
        Object.keys(props.fund.games),
        true
      );
    }
    if (props.fund.wagers) {
      const betKeys = Object.keys(props.fund.wagers);
      getBets(betKeys).then(bets => {
        const groupedBets = groupBy(bets, bet => (bet ? bet.gameId : null));
        this.setState({ groupedBets });
      });
    }
  };

  getGameTime(game, num) {
    this.gameTimes.splice(num, 0, game);
    if (this.gameTimes.length === Object.keys(this.props.fund.games).length) {
      this.forceUpdate();
    }
  }

  renderGames = (props, games, sendBack) =>
    games.map((game, index) => (
      <Game
        key={index}
        sendBack={sendBack}
        num={index}
        sendGameTime={this.getGameTime}
        size={props.size}
        game={game}
        bets={this.state.groupedBets[game]}
        userCurrent={props.userCurrent}
        userWager={props.userWager}
        user={props.user}
        league={props.fund.games[game]}
        fund={props.fund}
        isFade={this.props.isFade}
      />
    ));

  renderGroupedGames = (gameGrouped, noGames, dateStyle) => {
    if (this.props.fund.games) {
      if (
        Object.keys(gameGrouped)
          .map(v => gameGrouped[v])
          .reduce((total, item) => item.length + total, 0) <
        Object.keys(this.props.fund.games).length
      ) {
        return this.gameComponents;
      }
      return Object.keys(gameGrouped).map((key, index) => {
        const gamesGrouped = gameGrouped[key].map(g => g.id);
        return (
          <div key={index} style={{ backgroundColor: "#F5F5F5" }}>
            <div style={dateStyle}>
              {moment(key, "MM/DD/YYYY")
                .format("MMM DD")
                .toUpperCase()}
            </div>
            {this.renderGames(this.props, gamesGrouped, false)}
          </div>
        );
      });
    }
    return <h2 style={noGames}>No games have been wagered on yet</h2>;
  };

  render() {
    const noGames = { textAlign: "center", padding: 10 };
    const dateStyle = {
      color: "grey",
      marginTop: 16
    };

    let gameGrouped = [];
    if (this.gameTimes) {
      this.gameTimes = this.gameTimes.sort(
        (a, b) => b.scheduledTimeUnix - a.scheduledTimeUnix
      );
      gameGrouped = groupBy(this.gameTimes, result =>
        moment(result.scheduledTimeUnix).format("MM/DD/YYYY")
      );
    }

    return (
      <div className="tabContent">
        {this.renderGroupedGames(gameGrouped, noGames, dateStyle)}
      </div>
    );
  }
}
