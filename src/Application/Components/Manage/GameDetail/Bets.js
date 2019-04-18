// @flow

import React, { Component } from "react";
import Bet from "./Bet";

type BetsProps = {
  fund: Fund,
  user: User,
  game: Game,
  userWager: number,
  size: number,
  history: {}
};

export default class Bets extends Component<BetsProps> {
  constructor(props) {
    super(props);
    this.state = {
      wager: {}
    };
  }

  render() {
    const fund = this.props.fund;
    const allBetsObj = Object.assign({}, fund.wagers, fund.pendingBets);
    return (
      <div>
        {Object.keys(allBetsObj).map((betId, index) => (
          <Bet
            size={this.props.size}
            key={betId}
            index={index}
            userWager={this.props.userWager}
            fund={this.props.fund}
            user={this.props.user}
            betId={betId}
            game={this.props.game}
            history={this.props.history}
          />
        ))}
      </div>
    );
  }
}
