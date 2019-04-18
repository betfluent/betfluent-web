// @flow

import React, { Component } from "react";
import Confetti from "react-confetti";
import { getUserInteractionsFeed } from "../Services/DbService";

type WinningConfettiProps = {
  user: User,
  unread: number
};

export default class WinningConfetti extends Component<WinningConfettiProps> {
  constructor(props) {
    super(props);
    this.onInteractionsChange = this.onInteractionsChange.bind(this);
    this.state = {
      returnInteractions: []
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.interactionsFeed = getUserInteractionsFeed(
        this.props.user.id,
        this.props.user.publicId,
        this.onInteractionsChange
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      if (this.interactionsFeed) this.interactionsFeed.off();
      this.interactionsFeed = getUserInteractionsFeed(
        nextProps.user.id,
        nextProps.user.publicId,
        this.onInteractionsChange
      );
    }
  }

  componentWillUnmount() {
    if (this.interactionsFeed) this.interactionsFeed.off();
  }

  onInteractionsChange(userInteractions) {
    if (userInteractions) {
      const returnInteractions = userInteractions.filter(
        interaction => interaction.type === "Return"
      );
      this.setState({ returnInteractions });
    }
  }

  runConfetti = (user, returnInteractions) => {
    const unreadReturn = returnInteractions.filter(
      interaction => interaction.time > user.lastNotificationCheck
    );
    let runConfetti = false;
    if (unreadReturn !== []) {
      unreadReturn.forEach(returnInteraction => {
        const fundId = returnInteraction.fundId;
        const userWager = user.investments[fundId];
        if (returnInteraction.amount > userWager) {
          runConfetti = true;
        }
      });
    }
    return runConfetti;
  };

  render() {
    if (!this.props.user || this.props.unread === undefined) return null;

    // return (
    return null;
    // <Confetti
    //   className="winningConfetti"
    //   style={{ display: this.props.unread ? "block" : "none" }}
    //   recycle={false}
    //   numberOfPieces={300}
    //   run={this.runConfetti(this.props.user, this.state.returnInteractions)}
    // />
    // );
  }
}
