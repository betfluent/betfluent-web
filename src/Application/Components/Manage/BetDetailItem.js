// @flow

import React, { Component } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import Divider from "material-ui/Divider";
import { getBetFeed } from "../../Services/DbService";
import { mgMuiTheme } from "../ManagerStyles";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;

type BetProps = {
  betId: string,
  game: Game,
  fund: Fund,
  userWager: number
};

export default class Bet extends Component<BetProps> {
  constructor(props) {
    super(props);
    this.onBetChange = this.onBetChange.bind(this);
    this.state = {
      learningModalOpen: false
    };
  }

  componentDidMount() {
    this.betFeed = getBetFeed(this.props.betId, this.onBetChange);
  }

  componentWillUnmount() {
    if (this.betFeed) this.betFeed.off();
  }

  onBetChange(bet) {
    if (bet && bet.gameId === this.props.game.id) {
      this.setState({ bet });
    }
  }

  render() {
    if (!this.state.bet) return null;
    if (this.state.bet.gameId !== this.props.game.id) return null;

    const bet = this.state.bet;
    const betExplanation = bet.explanation();
    const betSummary = bet.summary();
    const betReturn = bet.resultAmount(this.props.game) - bet.wagered;
    const userBetReturn = () => {
      if (bet.status === "STAGED") {
        if (bet.pctOfFund) return bet.pctOfFund / 100;
        return bet.wagered / 100;
      }
      return this.props.userWager / this.props.fund.amountWagered * betReturn;
    };

    const betStyle = {
      position: "relative",
      paddingTop: 16,
      textAlign: "left",
      fontSize: 12,
      lineHeight: "16px",
      color: textColor1
    };

    const selectionStyle = {
      color: textColor3,
      fontSize: 12,
      lineHeight: "16px"
    };

    const betMsgStyle = {
      padding: 0,
      margin: 0,
      fontSize: 14,
      width: "78%"
    };

    const renderColor = () => {
      if (userBetReturn() === 0) {
        return textColor1;
      }
      if (userBetReturn() > 0) {
        return themeColor;
      }
      return alertColor;
    };

    const amountStyle = {
      position: "absolute",
      right: 0,
      top: 24,
      fontSize: 14,
      lineHeight: "24px",
      fontWeight: 500,
      color: renderColor()
    };

    return (
      <IntlProvider locale="en">
        <div style={{ marginTop: 16 }}>
          <Divider />
          <div style={betStyle}>
            <p style={betMsgStyle}>{betExplanation}</p>
            <span style={amountStyle}>
              <FormattedNumber
                style={
                  bet.pctOfFund && bet.status === "STAGED"
                    ? "percent"
                    : "currency"
                }
                currency="USD"
                minimumFractionDigits={2}
                value={userBetReturn()}
              />
            </span>
            <span style={selectionStyle}>{betSummary}</span>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
