// @flow
/* eslint-disable */

import React, { Component } from "react";
import Divider from "material-ui/Divider";
import Moment from "react-moment";
import ActivityItem from "../Fund/ActivityItem";
import Avatar from "../Avatar";
import { getFundInteractionsFeed, getManager } from "../../Services/DbService";
import { mgMuiTheme } from "../ManagerStyles";
import Fund from "../../Models/Fund";
import Manager from "../../Models/Manager";

const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;

type ActivityProps = {
  fund: Fund,
  user: Manager
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
    getFundInteractionsFeed(this.props.fund.id, interactions => {
      if (interactions) this.setState({ interactions });
    });
  }

  renderActivity() {
    if (this.state.interactions) {
      const interactions = this.state.interactions;
      return interactions
        .map((interaction, i) => {
          if (
            interaction.type !== "Return" ||
            (interaction.type === "Return" &&
              interaction.userId === this.props.user.publicId)
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
              <div style={titleStyle}>Influencer created pool</div>
              <div>
                <Moment fromNow style={subtitleStyle}>
                  {this.props.fund.createdTimeMillis}
                </Moment>
              </div>
            </div>
          </div>
          <Divider />
        </div>
        {this.props.fund.status === "RETURNED" ? null : (
          <div style={{ height: 96 }} />
        )}
      </div>
    );
  }
}
