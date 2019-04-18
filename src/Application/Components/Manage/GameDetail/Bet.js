// @flow

import React, { Component } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import Dialog from "material-ui/Dialog";
import { getBetFeed } from "../../../Services/DbService";
import { deleteBet } from "../../../Services/ManagerService";
import { mgMuiTheme } from "../../ManagerStyles";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;

type BetProps = {
  betId: string,
  game: Game,
  fund: Fund,
  userWager: number,
  history: {
    replace: () => void
  }
};

export default class Bet extends Component<BetProps> {
  constructor(props) {
    super(props);
    this.onBetChange = this.onBetChange.bind(this);
    this.state = {
      learningModalOpen: false,
      deleteBetOpen: false
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

    const betStyle = {
      position: "relative",
      padding: "20px 0",
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
      width: "80%"
    };

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

    const betTitleStyle = {
      textAlign: "center"
    };

    const buttonContainerStyle = {
      position: "absolute",
      bottom: 15,
      left: "50%",
      transform: "translateX(-50%)",
      width: "300px",
      textAlign: "center"
    };

    const buttonStyle = {
      position: "relative",
      display: "block"
    };

    const actions = [
      <RaisedButton
        key={0}
        label="Delete"
        style={buttonStyle}
        primary
        fullWidth
        onClick={() => {
          this.props.history.replace(`/manage/pools/${this.props.fund.id}`);
          deleteBet(bet.id);
          this.setState({ deleteBetOpen: false });
        }}
      />,
      <FlatButton
        key={1}
        label="Cancel"
        style={buttonStyle}
        labelStyle={{ color: alertColor }}
        fullWidth
        onClick={() => {
          this.setState({ deleteBetOpen: false });
        }}
      />
    ];

    return (
      <IntlProvider locale="en">
        <div>
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
            {bet.status === "STAGED" ? (
              <div className="deleteBtn" style={{ color: alertColor }}>
                <span
                  role="presentation"
                  onClick={() => {
                    this.setState({ deleteBetOpen: true });
                  }}
                >
                  Delete Bet
                </span>
              </div>
            ) : null}
          </div>
          <Divider />
          <Dialog
            title="Please Confirm"
            titleStyle={betTitleStyle}
            actions={actions}
            actionsContainerStyle={buttonContainerStyle}
            modal
            open={this.state.deleteBetOpen}
            bodyStyle={{ height: 240, overflowX: "hidden" }}
            contentStyle={{ width: 350 }}
            paperProps={{ style: { height: 240 } }}
            style={{ overflowY: "scroll" }}
          >
            <div>Are you sure you want to delete this bet?</div>
            <div
              style={{ textAlign: "center", marginTop: 12, color: textColor1 }}
            >
              {betSummary}
            </div>
          </Dialog>
        </div>
      </IntlProvider>
    );
  }
}
