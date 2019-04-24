// @flow
/* eslint-disable */

import React, { Component } from "react";
import WagerDetailItem from "./WagerDetailItem";

type WagersProps = {
  game: {
    id: string
  },
  userWager: number,
  userCurrent: number,
  fund: {
    amountWagered: number,
    wagers: {},
    percentFee: number
  },
  size: number,
  user: User
};

export default class Wagers extends Component<WagersProps> {
  constructor(props) {
    super(props);
    this.state = {
      wager: {}
    };
    this.updateData = this.updateData.bind(this);
  }

  updateData(wager, key) {
    if (!this.state.wager[key]) {
      const wagerObj = this.state.wager;
      wagerObj[key] = wager;
      this.setState({ wager: wagerObj });
    }
  }

  render() {
    let totalReturn = Object.keys(this.state.wager).map(
      k => this.state.wager[k]
    );

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

    return (
      <div>
        {Object.keys(this.props.fund.wagers).map((wager, index) => (
          <WagerDetailItem
            size={this.props.size}
            key={index}
            index={index}
            userWager={this.props.userWager}
            fund={this.props.fund}
            user={this.props.user}
            publicUser={this.props.user.public}
            wagerId={wager}
            game={this.props.game}
          />
        ))}
      </div>
    );
  }
}
