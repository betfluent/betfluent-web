// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import EmptyWork from "material-ui/svg-icons/action/work";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { appTheme } from "../Styles";
import Return from "./Return";
import User from "../../Models/User";
import { getFundFeed } from "../../Services/DbService";

type ReturnsProps = {
  user: User,
  returnedFundIds: []
};

export default class Returns extends Component<ReturnsProps> {
  constructor() {
    super();
    this.sortReturnedFunds = this.sortReturnedFunds.bind(this);
    this.fundFeeds = {};
    this.state = {};
  }

  componentDidMount() {
    this.sortReturnedFunds();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.returnedFundIds.length !== this.props.returnedFundIds.length
    ) {
      this.sortReturnedFunds();
    }
  }

  componentWillUnmount() {
    Object.keys(this.fundFeeds).forEach(fundId => this.fundFeeds[fundId].off());
  }

  sortReturnedFunds() {
    if (this.props.returnedFundIds.length) {
      Object.keys(this.fundFeeds).forEach(fundId =>
        this.fundFeeds[fundId].off()
      );
      const returnedFunds = {};
      this.props.returnedFundIds.forEach(fundId => {
        this.fundFeeds[fundId] = getFundFeed(fundId, fund => {
          returnedFunds[fundId] = fund;
          if (
            Object.keys(returnedFunds).length ===
            this.props.returnedFundIds.length
          ) {
            const sortedReturnedFunds = groupBy(returnedFunds, returnedFund =>
              moment(returnedFund.returnTimeMillis).format("MM/DD/YY")
            );
            this.setState({
              sortedReturnedFunds
            });
          }
        });
      });
    }
  }

  renderReturns() {
    const sortedReturnedFunds = this.state.sortedReturnedFunds;
    return Object.keys(sortedReturnedFunds)
      .sort()
      .map(date => (
        <div key={date}>
          <div>{date}</div>
          {sortedReturnedFunds[date]
            .sort((a, b) => b.returnTimeMillis - a.returnTimeMillis)
            .map(fund => (
              <Return key={fund.id} fund={fund} user={this.props.user} />
            ))}
        </div>
      ))
      .reverse();
  }

  render() {
    if (!this.props.returnedFundIds.length) {
      return (
        <div className="emptyPortfolio">
          <EmptyWork />
          <p>
            No returned pools in your Portfolio.<br />Explore the Lobby.
          </p>
        </div>
      );
    }

    if (!this.state.sortedReturnedFunds) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="center-flex" style={{ marginTop: 48 }}>
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    return (
      <div className="tabContent PortfolioCards">{this.renderReturns()}</div>
    );
  }
}
