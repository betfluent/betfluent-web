// @flow
/* eslint-disable */

import React, { Component } from "react";
import Wager from "./Wager";

type WagersProps = {
  fund: Fund,
  user: User,
  game: {
    id: string
  },
  userWager: number,
  size: number,
  location: {}
};

export default class Wagers extends Component<WagersProps> {
  constructor(props) {
    super(props);
    this.state = {
      wager: {}
    };
  }

  render() {
    return (
      <div>
        {this.props.fund.wagers && Object.keys(this.props.fund.wagers).map((wager, index) => (
          <Wager
            size={this.props.size}
            key={index}
            index={index}
            userWager={this.props.userWager}
            fund={this.props.fund}
            user={this.props.user}
            wagerId={wager}
            game={this.props.game}
            location={this.props.location}
          />
        ))}
      </div>
    );
  }
}
