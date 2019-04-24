// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import { gMuiTheme } from "./Styles";
import moneylineB from "../../Assets/moneyline_blue.png";
import spreadB from "../../Assets/spread_blue.png";
import overunderB from "../../Assets/overunder_blue.png";
import progressBar from "../../Assets/progressBarGreen.png";

type CardProps = {
  betDetail: string,
  betType: string,
  wagerAmount: number,
  couldWin: number,
  couldProfit: number,
  toWin: string
};

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;

export default class LearningModalCard extends Component<CardProps> {
  renderIcon = betType => {
    switch (betType) {
      case "MONEYLINE":
        return (
          <img
            src={moneylineB}
            alt={betType}
            style={{ height: 28, marginTop: 8 }}
          />
        );
      case "SPREAD":
        return (
          <img
            src={spreadB}
            alt={betType}
            style={{ height: 28, marginTop: 8 }}
          />
        );
      case "OVER_UNDER":
        return (
          <img
            src={overunderB}
            alt={betType}
            style={{ height: 24, marginTop: 10 }}
          />
        );
      default:
        return null;
    }
  };

  renderBetType = betType => {
    if (betType === "OVER_UNDER") {
      return "OVER/UNDER";
    }
    return betType;
  };

  render() {
    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor3
    };

    return (
      <div>
        <div
          className="modalCardHeader"
          style={{ backgroundColor: themeColor }}
        >
          {this.props.betDetail}
        </div>
        <div className="betType" style={{ color: themeColor }}>
          {this.renderBetType(this.props.betType)}
        </div>
        <div className="betIcon">{this.renderIcon(this.props.betType)}</div>
        <div className="modalCardContent flexVertical">
          <img src={progressBar} alt="Betfluent" />
          <div className="betNumbersContainer">
            <div className="betNumbers" style={{ color: textColor1 }}>
              ${this.props.wagerAmount}
            </div>
            <div className="betNumExplanation">
              <h3 style={{ color: textColor2 }}>AT STAKE</h3>
              <p style={{ color: textColor3 }}>Amount you bet</p>
            </div>
          </div>
          <div className="betNumbersContainer">
            <div className="betNumbers" style={{ color: themeColor }}>
              ${this.props.couldWin}
            </div>
            <div className="betNumExplanation">
              <h3 style={{ color: textColor2 }}>COULD WIN</h3>
              <p style={{ color: textColor3 }}>Amount this bet returns</p>
            </div>
          </div>
          <div className="betNumbersContainer" style={{ marginBottom: 0 }}>
            <div className="betNumbers" style={{ color: themeColor }}>
              ${this.props.couldProfit}
            </div>
            <div className="betNumExplanation">
              <h3 style={{ color: textColor2 }}>COULD PROFIT</h3>
            </div>
          </div>
        </div>
        <div className="modalCardContent">
          <div style={subtitleStyle}>TO WIN</div>
          <p style={{ color: textColor1 }}>{this.props.toWin}</p>
        </div>
      </div>
    );
  }
}
