// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import Divider from "material-ui/Divider";
import { getBetFeed, getUserPredictionFeed } from "../../../Services/DbService";
import { gMuiTheme } from "../../Styles";
import LearningModal from "../LearningModal";
import Fund from "../../../Models/Fund";
import Game from "../../../Models/Game";
import User from "../../../Models/User";
import BetPrediction from "../BetPrediction";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

const renderAmountColor = props => {
  if (props.userBetReturn === 0) {
    return props.textColor1;
  }
  if (props.userBetReturn > 0) {
    return props.themeColor;
  }
  return props.alertColor;
};

type WagerProps = {
  fund: Fund,
  wagerId: string,
  game: Game,
  user: User,
  userWager: number,
  size: number,
  location: {}
};

export default class Wager extends Component<WagerProps> {
  constructor(props) {
    super(props);
    this.wagerId = props.wagerId;
    this.onBetChange = this.onBetChange.bind(this);
    this.onUserPredictionChange = this.onUserPredictionChange.bind(this);
    this.state = {
      learningModalOpen: false
    };
  }

  componentDidMount() {
    this.betFeed = getBetFeed(this.wagerId, this.onBetChange);
    this.userPredictionFeed = getUserPredictionFeed(
      this.props.user.publicId,
      this.props.wagerId,
      this.onUserPredictionChange
    );
  }

  componentWillUnmount() {
    if (this.betFeed) this.betFeed.off();
    if (this.userPredictionFeed) this.userPredictionFeed.off();
  }

  onBetChange(wager) {
    if (wager && wager.gameId === this.props.game.id) {
      this.setState({ wager });
    }
  }

  onUserPredictionChange(prediction) {
    if (prediction) {
      this.setState({ willWin: prediction.willWin });
    }
  }

  render() {
    if (!this.state.wager) return null;
    if (this.state.wager.gameId !== this.props.game.id) return null;

    const game = this.props.game;
    const wager = this.state.wager;
    const wagered = wager.wagered;
    const wagerExplanation = wager.explanation();
    const wagerSummary = wager.summary();
    const userWagered =
      this.props.userWager / this.props.fund.amountWagered * wagered;
    const betReturn = wager.resultAmount(this.props.game) - wager.wagered;
    const userBetReturn =
      this.props.userWager / this.props.fund.amountWagered * betReturn;

    const wagerStyle = {
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

    const wagerMsgStyle = {
      padding: 0,
      margin: 0,
      fontSize: 14,
      width: "80%"
    };

    const amountStyle = {
      position: "absolute",
      right: 0,
      top: 24,
      fontSize: 14,
      lineHeight: "24px",
      fontWeight: 500,
      color: renderAmountColor({
        userBetReturn,
        textColor1,
        themeColor,
        alertColor
      })
    };

    return (
      <IntlProvider locale="en">
        <div>
          <div style={wagerStyle}>
            <p style={wagerMsgStyle}>{wagerExplanation}</p>
            <span style={amountStyle}>
              <FormattedNumber
                style="currency"
                currency="USD"
                minimumFractionDigits={2}
                value={userBetReturn}
              />
            </span>
            <span style={selectionStyle}>{wagerSummary}</span>
            <div className="flexContainer">
              <div
                role="presentation"
                className="learnMoreBtn"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ learningModalOpen: true });
                }}
              >
                BET DETAILS
              </div>
            </div>
            <LearningModal
              open={this.state.learningModalOpen}
              handleClose={() => this.setState({ learningModalOpen: false })}
              wager={wager}
              userWagered={userWagered}
              size={this.props.size}
            />
          </div>
          <Divider />
        </div>
      </IntlProvider>
    );
  }
}
