// @flow
/* eslint-disable */

import React, { Component } from "react";
import Bet from "./BetDetailItem";

type BetsProps = {
  fund: Fund,
  user: User,
  game: Game,
  userCurrent: number,
  userWager: number,
  size: number
};

export default class Bets extends Component<BetsProps> {
  constructor(props) {
    super(props);
    this.state = {
      bet: {}
    };
    this.updateData = this.updateData.bind(this);
  }

  updateData(bet, key) {
    if (!this.state.bet[key]) {
      const betObj = this.state.bet;
      betObj[key] = bet;
      this.setState({ bet: betObj });
    }
  }

  render() {
    let totalReturn = Object.keys(this.state.bet).map(k => this.state.bet[k]);

    if (totalReturn.length > 0) {
      totalReturn =
        this.props.userWager *
        100 /
        this.props.fund.amountWagered *
        totalReturn.reduce((total, item) => total + item);
      totalReturn =
        this.props.userCurrent > this.props.userWager
          ? totalReturn * (1 - this.props.fund.percentFee / 100)
          : totalReturn;
    }

    const fund = this.props.fund;
    const allBets = Object.assign({}, fund.wagers, fund.stagedBets);

    return (
      <div>
        {Object.keys(allBets).map((betId, index) => (
          <Bet
            size={this.props.size}
            key={index}
            index={index}
            userWager={this.props.userWager}
            fund={fund}
            user={this.props.user}
            betId={betId}
            game={this.props.game}
          />
        ))}
      </div>
    );
  }
}
