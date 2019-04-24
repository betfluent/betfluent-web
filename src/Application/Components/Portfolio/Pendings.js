// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import EmptyWork from "material-ui/svg-icons/action/work";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pending from "./Pending";
import { appTheme } from "../Styles";
import { getFundFeed } from "../../Services/DbService";

type PendingsProps = {
  user: User,
  pendingFundIds: []
};

export default class Pendings extends Component<PendingsProps> {
  constructor() {
    super();
    this.sortPendingFunds = this.sortPendingFunds.bind(this);
    this.fundFeeds = {};
    this.state = {};
  }

  componentDidMount() {
    this.sortPendingFunds();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pendingFundIds.length !== this.props.pendingFundIds.length) {
      this.sortPendingFunds();
    }
  }

  componentWillUnmount() {
    Object.keys(this.fundFeeds).forEach(fundId => this.fundFeeds[fundId].off());
  }

  sortPendingFunds() {
    if (this.props.pendingFundIds.length) {
      Object.keys(this.fundFeeds).forEach(fundId =>
        this.fundFeeds[fundId].off()
      );
      const liveFunds = {};
      const pendingFunds = {};
      this.props.pendingFundIds.forEach(fundId => {
        this.fundFeeds[fundId] = getFundFeed(fundId, fund => {
          if (fund.hasPendingBets()) {
            liveFunds[fundId] = fund;
          } else {
            pendingFunds[fundId] = fund;
          }
          if (
            Object.keys(liveFunds).length + Object.keys(pendingFunds).length ===
            this.props.pendingFundIds.length
          ) {
            this.setState({
              liveFunds: Object.keys(liveFunds).map(
                liveFundId => liveFunds[liveFundId]
              ),
              pendingFunds: Object.keys(pendingFunds).map(
                pendingFundId => pendingFunds[pendingFundId]
              )
            });
          }
        });
      });
    }
  }

  render() {
    if (!this.props.pendingFundIds.length) {
      return (
        <div className="emptyPortfolio">
          <EmptyWork />
          <p>
            No pending pools in your Portfolio.<br />Explore the Lobby.
          </p>
        </div>
      );
    }

    if (!this.state.liveFunds || !this.state.pendingFunds) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="center-flex" style={{ marginTop: 48 }}>
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    return (
      <div className="tabContent PortfolioCards">
        {this.state.liveFunds.map(fund => (
          <Pending key={fund.id} user={this.props.user} fund={fund} live />
        ))}
        {this.state.pendingFunds.map(fund => (
          <Pending key={fund.id} user={this.props.user} fund={fund} />
        ))}
      </div>
    );
  }
}
