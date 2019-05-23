// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import Divider from "material-ui/Divider";
import Moment from "react-moment";
import Avatar from "../Avatar";
import { getPublicUser, getManager } from "../../Services/DbService";
import { mgMuiTheme } from "../ManagerStyles";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;

type ActivityItemProps = {
  interaction: {
    userId: string,
    managerId: string,
    type: string,
    amount: number,
    userName: string,
    wagerSummary: string,
    wagerAmount: number,
    time: string
  },
  user: User
};

export default class ActivityItem extends Component<ActivityItemProps> {
  constructor(props) {
    super(props);
    this.state = {
      publicUser: {}
    };
  }

  componentWillMount() {
    if (this.props.interaction && this.props.interaction.userId) {
      getPublicUser(this.props.interaction.userId).then(publicUser => {
        if (publicUser) this.setState({ publicUser });
      });
    } else if (this.props.interaction && this.props.interaction.managerId) {
      getManager(this.props.interaction.managerId).then(publicUser => {
        if (publicUser) this.setState({ publicUser });
      });
    }
  }

  render() {
    let title = null;
    let amountColor = themeColor;
    let amount = null;

    if (this.props.interaction.type === "Wager") {
        title = "You wagered";
        amount = this.props.interaction.amount;
        amountColor = textColor1;
    } else if (this.props.interaction.type === "Wager Against") {
        title = "You wagered against";
        amount = this.props.interaction.amount;
        amountColor = textColor1;
    } else if (this.props.interaction.type === "Bet") {
      title = `Bet on ${this.props.interaction.wagerSummary}`;
      amount = this.props.interaction.amount;
      amountColor = textColor1;
    } else if (this.props.interaction.type.indexOf("Result") !== -1) {
      title = `${this.props.interaction.type} from ${
        this.props.interaction.wagerSummary
      }`;
      if (this.props.interaction.amount > this.props.interaction.wagerAmount) {
        amount =
          this.props.interaction.amount - this.props.interaction.wagerAmount;
        amountColor = themeColor;
      } else if (
        this.props.interaction.amount === this.props.interaction.wagerAmount
      ) {
        amount = 0;
        amountColor = textColor1;
      } else {
        amount = -this.props.interaction.wagerAmount;
        amountColor = alertColor;
      }
    } else if (
      this.props.interaction.type === "Return" &&
      this.props.user.publicId === this.props.interaction.userId
    ) {
      title = "You returned";
      if (this.props.interaction.amount > 0) {
        amount = this.props.interaction.amount;
        amountColor = themeColor;
      } else if (this.props.interaction.amount === 0) {
        amount = this.props.interaction.amount;
        amountColor = textColor1;
      } else {
        amount = this.props.interaction.amount;
        amountColor = alertColor;
      }
    }

    const renderAmount = () => {
      if (
        this.props.user &&
        this.props.user.publicId === this.props.interaction.userId ||
        this.props.interaction.type !== "Wager" || this.props.interaction.type !== "Wager Against"
      ) {
        if (amount >= 0) {
          return `$${(amount / 100).toFixed(2)}`;
        }
        return `-$${(Math.abs(amount) / 100).toFixed(2)}`;
      }
      return null;
    };

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

    const wagerAmountStyle = {
      fontSize: 14,
      lineHeight: "24px",
      fontWeight: 500,
      color: amountColor,
      marginLeft: 8
    };

    return (
      <div key={this.props.interaction.time} className="activityInOpenFund">
        <div
          className="flexContainer"
          style={{ flexWrap: "nowrap", alignItems: "center" }}
        >
          {this.state.publicUser.name ? (
            <Avatar
              userName={this.state.publicUser.name}
              userAvatar={this.state.publicUser.avatarUrl}
              width={32}
            />
          ) : null}
          <div style={{ flexGrow: 1, textAlign: "left" }}>
            <div style={titleStyle}>{title}</div>
            <div>
              <Moment fromNow style={subtitleStyle}>
                {this.props.interaction.time}
              </Moment>
            </div>
          </div>
          <div style={wagerAmountStyle}>{renderAmount()}</div>
        </div>
        <Divider />
      </div>
    );
  }
}
