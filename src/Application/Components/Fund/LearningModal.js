// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "../Styles";
import LearningModalCard from "../LearningModalCard";

const themeColor = gMuiTheme.palette.themeColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type LearningModalProps = {
  handleClose: () => void,
  open: boolean,
  wager: number,
  userWagered: number,
  size: number
};

export default class LearningModalDialog extends Component<LearningModalProps> {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: props.open
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  handleClose() {
    this.props.handleClose();
  }

  toWin = wager => {
    if (wager.type === "MONEYLINE") {
      return `${wager.explanation()} This is known as a Moneyline bet.`;
    } else if (wager.type === "SPREAD") {
      return `${wager.explanation()} ${
        Number.isInteger(wager.points)
          ? `If the ${wager.selection} ${
              wager.points < 0 ? "win" : "lose"
            } by exactly ${Math.abs(
              wager.points
            )} points, your money is returned.`
          : ""
      } This is known as a Spread bet.`;
    } else if (wager.type === "OVER_UNDER") {
      return `${wager.explanation()} This is known as an Over/Under bet.`;
    }
    return null;
  };

  render() {
    const buttonContainerStyle = {
      position: "relative",
      top: this.props.size > mobileBreakPoint ? -32 : -24,
      height: 24,
      left: "50%",
      transform: "translateX(-50%)",
      width: 200,
      textAlign: "center"
    };

    const buttonStyle = {
      display: "block",
      color: themeColor
    };

    const actions = [
      <FlatButton
        key={0}
        label="CLOSE"
        style={buttonStyle}
        fullWidth
        onClick={this.handleClose}
      />
    ];

    const wager = this.props.wager;
    const userWagered = this.props.userWagered.toFixed(2);
    const couldProfit = (wager.returning < 0
      ? userWagered / Math.abs(wager.returning) * 100
      : userWagered * wager.returning / 100
    ).toFixed(2);
    const couldWin = (Number(couldProfit) + Number(userWagered)).toFixed(2);

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Dialog
          contentClassName="dialogContent"
          actions={actions}
          actionsContainerStyle={buttonContainerStyle}
          modal
          open={this.state.open}
          paperProps={{ style: { minHeight: 430 } }}
          bodyStyle={{ height: 450, overflowX: "hidden", padding: 0 }}
          style={{ overflowY: "scroll" }}
        >
          <LearningModalCard
            betDetail={wager.summary()}
            betType={wager.type}
            toWin={this.toWin(wager)}
            wagerAmount={userWagered}
            couldWin={couldWin}
            couldProfit={couldProfit}
          />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
