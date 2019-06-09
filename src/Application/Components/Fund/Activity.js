// @flow
/* eslint-disable */

import React, { Component } from "react";
import Divider from "material-ui/Divider";
import Moment from "react-moment";
import ActivityItem from "./ActivityItem";
import Avatar from "../Avatar";
import { getFundInteractionsFeed, getManager } from "../../Services/DbService";
import { gMuiTheme } from "../Styles";
import Fund from "../../Models/Fund";
import User from "../../Models/User";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;

type ActivityProps = {
  fund: Fund,
  user: User
};

type ActiviyState = {
  interactions: {
    time: number,
    userId: string,
    amount: number
  }[]
};

export default class Activity extends Component<ActivityProps, ActiviyState> {
  state = {};

  componentWillMount() {
    getManager(this.props.fund.managerId).then(manager => {
      this.setState({ manager });
    });
  }

  componentDidMount() {
    this.activityFeed = getFundInteractionsFeed(
      this.props.fund.id,
      interactions => {
        if (interactions) this.setState({ interactions });
      }
    );
  }

  componentWillUnmount() {
    if (this.activityFeed) this.activityFeed.off();
  }

  renderActivity() {
    if (this.state.interactions) {
      const interactions = this.state.interactions;
      const user = this.props.user;
      return interactions
        .map((interaction, i) => {
          if (
            (interaction.type !== "Return" && !interaction.type.includes('Bet') && !interaction.type.includes('Result')) ||
            (interaction.type === "Return" &&
              interaction.userId === user.publicId) ||
            ((interaction.type.includes('Bet') || interaction.type.includes('Result')) && 
            interaction.fade === (user.investments && user.investments[interaction.fundId] < 0))
          ) {
            return (
              <ActivityItem
                key={i}
                interaction={interaction}
                user={this.props.user}
              />
            );
          }
          return null;
        })
        .reverse();
    }
    return null;
  }

  render() {
    const fund = this.props.fund;

    const titleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor1,
      fontWeight: 400
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor3
    };

    return (
      <div className="tabContent">
        {this.renderActivity()}
        <div className="activityInOpenFund">
          <div
            className="flexContainer"
            style={{ flexWrap: "nowrap", alignItems: "center" }}
          >
            {this.state.manager ? (
              <Avatar
                width={32}
                userName={this.state.manager.name}
                userAvatar={this.state.manager.avatarUrl}
              />
            ) : null}
            <div style={{ flexGrow: 1, textAlign: "left" }}>
              <div style={titleStyle}>
                {fund.manager.name} created betting pool
              </div>
              <div>
                <Moment fromNow style={subtitleStyle}>
                  {fund.createdTimeMillis}
                </Moment>
              </div>
            </div>
          </div>
          <Divider />
        </div>
      </div>
    );
  }
}
