// @flow
/* eslint-disable */

import React, { Component } from "react";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import EmptyRecent from "material-ui/svg-icons/action/restore";
import { Card } from "material-ui/Card";
import { Link } from "react-router-dom";
import { appTheme, gMuiTheme } from "../Styles";
import {
  getUserInteractionsFeed,
  updateUserNotificationView
} from "../../Services/DbService";
import Interaction from "./Interaction";
import FundInteractions from "./FundInteractions";

const textColor3 = gMuiTheme.palette.textColor3;

type RecentTransactionsProps = {
  user: User,
  show: boolean,
  size: number
};

export default class RecentTransactions extends Component<
  RecentTransactionsProps
> {
  constructor(props) {
    super(props);
    this.userId = props.user.id;
    this.fundInteractions = [];
    this.userInteractions = [];
    this.state = { loading: true };
    this.onInteractionsChange = this.onInteractionsChange.bind(this);
    this.receiveFundInteractions = this.receiveFundInteractions.bind(this);
  }

  componentWillMount() {
    this.interactionsFeed = getUserInteractionsFeed(
      this.userId,
      this.props.user.publicId,
      this.onInteractionsChange
    );
  }

  componentDidMount() {
    if (this.props.show && this.props.user) {
      updateUserNotificationView(this.props.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.lastNotificationCheck !==
      this.props.user.lastNotificationCheck
    ) {
      this.aggregateData();
    }
  }

  componentWillUnmount() {
    if (this.interactionsFeed) this.interactionsFeed.off();
  }

  onInteractionsChange(interactions) {
    if (interactions) {
      this.userInteractions = interactions;
    }
    this.getFundInteractions(this.props);
  }

  getFundInteractions(props) {
    const userFunds = props.user.investments;
    this.fundObjects = userFunds
      ? Object.keys(userFunds).map((fund, index) => (
          <FundInteractions
            key={index}
            num={index}
            fund={fund}
            sendBack={this.receiveFundInteractions}
          />
        ))
      : null;
    if (!userFunds) {
      this.aggregateData();
    } else {
      this.forceUpdate();
    }
  }

  aggregateData() {
    let fundFilteredInteractions = [];
    if (this.fundInteractions) {
      const fundInteractions = flatten(this.fundInteractions);
      fundFilteredInteractions = fundInteractions.filter(
        interaction =>
          interaction.type !== "Wager" && interaction.type !== "Return"
      );
    }

    const userInteractions = Object.keys(this.userInteractions).map(
      k => this.userInteractions[k]
    );
    const allInteractions = userInteractions.concat(fundFilteredInteractions);
    const sortedInteractions = allInteractions.sort((a, b) => b.time - a.time);

    const groupedInteractions = groupBy(sortedInteractions, result =>
      moment(result.time).format("YYYY-MM-DD")
    );
    const loading = false;
    this.setState({ interactions: groupedInteractions, loading });
  }

  receiveFundInteractions(interactions, num) {
    this.fundInteractions.splice(num, 0, interactions);
    if (this.fundInteractions.length === this.fundObjects.length)
      this.aggregateData();
  }

  renderTransaction = props =>
    this.state.interactions[props.date].map((interaction, i) => {
      if (interaction.fundId) {
        if (interaction.gameId) {
          return (
            <Link
              key={i}
              to={`/pools/${interaction.fundId}/${interaction.gameId}`}
            >
              <Interaction
                key={i}
                size={this.props.size}
                interaction={interaction}
                user={this.props.user}
              />
            </Link>
          );
        }
        return (
          <Link key={i} to={`/pools/${interaction.fundId}`}>
            <Interaction
              key={i}
              size={this.props.size}
              interaction={interaction}
              user={this.props.user}
            />
          </Link>
        );
      }
      return (
        <Interaction
          key={i}
          size={this.props.size}
          interaction={interaction}
          user={this.props.user}
        />
      );
    });

  renderRecentTransactions = props => {
    if (
      this.state &&
      this.state.interactions &&
      Object.keys(this.state.interactions).length > 0
    ) {
      return Object.keys(this.state.interactions).map((date, index) => (
        <div key={index}>
          <div style={props.dateStyle}>
            <div className="contentHeader recentText">
              {moment(date).format("MMMM DD, YYYY")}
            </div>
          </div>
          <Card className="contentHeader" zDepth={2}>
            {this.renderTransaction({ date })}
          </Card>
        </div>
      ));
    }
    if (!this.state.loading) {
      return (
        <div key={0} className="emptyPageHolder">
          <EmptyRecent />
          <p>
            Your recent activity will appear here. Check out the lobby to start
            getting in on the action!
          </p>
        </div>
      );
    }
    return (
      <MuiThemeProvider theme={appTheme}>
        <div className="fill-window center-flex">
          <CircularProgress />
        </div>
      </MuiThemeProvider>
    );
  };

  render() {
    const dateStyle = {
      backgroundColor: "#f5f5f5",
      padding: "12px 0",
      textAlign: "left",
      color: textColor3
    };

    return (
      <div style={{ paddingBottom: 24 }}>
        {[this.fundObjects, this.renderRecentTransactions({ dateStyle })]}
      </div>
    );
  }
}
