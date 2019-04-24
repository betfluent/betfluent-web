// @flow
/* eslint-disable */

import { Component } from "react";
import { getFundInteractionsFeed } from "../../Services/DbService";

type FundInteractionsProps = {
  fund: string,
  num: number,
  sendBack: () => void
};

export default class FundInteractions extends Component<FundInteractionsProps> {
  constructor(props) {
    super(props);
    this.fundId = props.fund;
    this.onInteractionsChange = this.onInteractionsChange.bind(this);
  }

  componentWillMount() {
    this.interactionsFeed = getFundInteractionsFeed(
      this.fundId,
      this.onInteractionsChange
    );
  }

  componentWillUnmount() {
    if (this.interactionsFeed) this.interactionsFeed.off();
  }

  onInteractionsChange(interactions) {
    if (interactions) {
      const interactionsArray = Object.keys(interactions).map(
        k => interactions[k]
      );
      this.props.sendBack(interactionsArray, this.props.num);
    }
  }

  render() {
    return null;
  }
}
