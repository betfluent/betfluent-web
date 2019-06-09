// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import Divider from "material-ui/Divider";
import { gMuiTheme } from "../Styles";
import { getFund } from "../../Services/DbService";

const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;

type InteractionProps = {
  interaction: {},
  user: User
};

export default class Interaction extends Component<InteractionProps> {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const interaction = this.props.interaction;
    if (interaction.fundId) {
      getFund(interaction.fundId).then(fund => {
        const userRatio =
          this.props.user.investments[interaction.fundId] / fund.amountWagered;
        this.setState({ userRatio, fund });
      });
    }
  }

  render() {
    const interaction = this.props.interaction;
    const fund = this.state.fund;

    const parentStyle = {
      padding: "18px 0 0 0",
      margin: "auto"
    };

    const fundStyle = {
      textAlign: "left",
      verticalAlign: "top"
    };

    const rightStyle = {
      textAlign: "right"
    };

    const intStyle = {
      textAlign: "right",
      color: textColor1
    };

    const balanceStyle = {
      textAlign: "right",
      color: textColor3
    };

    let interactionType;
    let interactionAmount;

    if (interaction.type === "Bet" && fund) {
      interactionType = `${
        fund.manager.name
      } ${interaction.type.toUpperCase()}`;
    } else if (interaction.type === "Wager") {
      interactionType = "YOU WAGERED";
    } else {
      interactionType = interaction.type.toUpperCase();
    }

    if (
      (interaction.type === "Bet" ||
        interaction.type.indexOf("Result") !== -1) &&
      this.state.userRatio
    ) {
      interactionAmount = (
        (interaction.amount *
        this.state.userRatio /
        100) || 0
      ).toFixed(2);
    } else {
      interactionAmount = interaction.amount / 100;
    }

    return (
      <div className="recentCard recentText">
        <div style={parentStyle}>
          <div style={fundStyle}>
            <div>
              {interaction && interaction.fundName
                ? interaction.fundName
                : null}
            </div>
          </div>
          <div style={rightStyle}>
            {interaction && interaction.type.indexOf("DOCUMENT") !== -1 ? (
              <div style={intStyle}>{interaction.type}</div>
            ) : null}
            {interaction &&
            interaction.type &&
            (interaction.amount || interaction.amount === 0) ? (
              <div style={intStyle}>
                {[interactionType, " $", interactionAmount]}
              </div>
            ) : null}
            {interaction && interaction.userBalance ? (
              <div style={balanceStyle}>
                Running Balance: {interaction.userBalance}
              </div>
            ) : null}
            {interaction && interaction.wagerSummary ? (
              <div style={balanceStyle}>{interaction.wagerSummary}</div>
            ) : null}
          </div>
          <Divider style={{ marginTop: 18 }} />
        </div>
      </div>
    );
  }
}
