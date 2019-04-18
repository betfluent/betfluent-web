import React, { Component } from "react";
import * as Scroll from "react-scroll";
import { Card } from "material-ui/Card";
import ArrowUp from "material-ui/svg-icons/hardware/keyboard-arrow-up";
import Bet from "../Models/Bet";
import LearningModalCard from "./LearningModalCard";
import { gMuiTheme } from "./Styles";

const themeColor = gMuiTheme.palette.themeColor;
const themeColorLight = gMuiTheme.palette.themeColorLight;
const textColor2 = gMuiTheme.palette.textColor2;

const ScrollLink = Scroll.Link;
const ScrollElement = Scroll.Element;

export default class SportsBetsExplained extends Component {
  constructor(props) {
    super(props);
    this.selected = 0;
    this.state = {
      betType: "MONEYLINE",
      betDetail: "Los Angeles Lakers (+200)",
      wagerAmount: 100,
      couldWin: 300,
      couldProfit: 200,
      toWin: "Los Angeles Lakers must win. This is known as a Moneyline bet."
    };
  }

  updateCard(team, betType, points, odds) {
    const activeBet = {
      selection: team,
      type: betType,
      wagered: 100,
      points,
      returning: odds,
      overUnder: team
    };
    const betObj = new Bet(activeBet);
    const wagerAmount = this.state.wagerAmount;
    const pointsValue = Math.ceil(Math.abs(points));
    if (odds > 0) {
      this.setState({
        couldWin: Math.abs(odds) + wagerAmount,
        couldProfit: Math.abs(odds)
      });
    } else {
      this.setState({
        couldWin: (100 * wagerAmount / Math.abs(odds) + wagerAmount).toFixed(2),
        couldProfit: (100 * wagerAmount / Math.abs(odds)).toFixed(2)
      });
    }

    if (betType === "MONEYLINE") {
      this.setState({
        betType: "MONEYLINE",
        betDetail: `${betObj.summary()}`,
        toWin: `${betObj.explanation()} This is known as a Moneyline bet.`
      });
    } else if (betType === "SPREAD") {
      this.setState({
        betType: "SPREAD",
        betDetail: `${betObj.summary()}`,
        toWin: `${betObj.explanation()} ${
          Number.isInteger(points)
            ? `If the ${team} ${
                points < 0 ? "win" : "lose"
              } by exactly ${pointsValue} points, your money is returned.`
            : ""
        } This is known as a Spread bet.`
      });
    } else if (betType === "OVER_UNDER") {
      this.setState({
        betType: "OVER_UNDER",
        betDetail: `${betObj.summary()}`,
        toWin: `${betObj.explanation()} This is known as an Over/Under bet.`
      });
    }
  }

  render() {
    const arrowUpStyle = {
      color: themeColor,
      width: 32,
      height: 32,
      position: "relative",
      top: 8
    };

    return (
      <div className="betExplanation">
        <ScrollElement name="betExplanation" />
        <div className="lpContent">
          <h1>Sports Bets Explained</h1>
          <div className="explanationContainer">
            <div className="explanationText">
              <div className="explanationCopy" style={{ color: textColor2 }}>
                Your favorite teams are playing tonight - it&apos;s time to get
                some action on the game. You go to an online Sports Book and you
                see bets like the ones below. &quot;What do all of those numbers
                mean,&quot; you ask. That&apos;s where we&apos;ve got your back.
                <br />
                <br />
                Let&apos;s put $100 on the game. Click on any button below for a
                clear explanation.
              </div>

              <div className="betBook betMoneyline flexVertical">
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 0 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 0;
                      this.updateCard(
                        "Los Angeles Lakers",
                        "MONEYLINE",
                        0,
                        200
                      );
                    }}
                  >
                    <p>+200</p>
                    <p>Lakers Moneyline</p>
                  </div>
                </ScrollLink>
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 1 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 1;
                      this.updateCard(
                        "Los Angeles Lakers",
                        "SPREAD",
                        5.5,
                        -110
                      );
                    }}
                  >
                    <p>+5.5 (-110)</p>
                    <p>Lakers Spread</p>
                  </div>
                </ScrollLink>
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 2 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 2;
                      this.updateCard("over", "OVER_UNDER", 209, -115);
                    }}
                  >
                    <p>209 (-115)o</p>
                    <p>Total Over</p>
                  </div>
                </ScrollLink>
              </div>

              <div className="betBook betSpread flexVertical">
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 3 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 3;
                      this.updateCard("Boston Celtics", "MONEYLINE", 0, -300);
                    }}
                  >
                    <p>-300</p>
                    <p>Celtics Moneyline</p>
                  </div>
                </ScrollLink>
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 4 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 4;
                      this.updateCard("Boston Celtics", "SPREAD", -5.5, -110);
                    }}
                  >
                    <p>-5.5 (-110)</p>
                    <p>Celtics Spread</p>
                  </div>
                </ScrollLink>
                <ScrollLink
                  to="explanationCard"
                  smooth
                  offset={-120}
                  duration={500}
                >
                  <div
                    className="betOptions"
                    role="presentation"
                    style={{
                      backgroundColor:
                        this.selected === 5 ? themeColorLight : ""
                    }}
                    onClick={() => {
                      this.selected = 5;
                      this.updateCard("under", "OVER_UNDER", 209, -115);
                    }}
                  >
                    <p>209 (-115)u</p>
                    <p>Total Under</p>
                  </div>
                </ScrollLink>
              </div>
            </div>

            <div className="explanationCard">
              <ScrollElement name="explanationCard" />
              <Card className="modalCard" zDepth={2}>
                <LearningModalCard
                  betDetail={this.state.betDetail}
                  betType={this.state.betType}
                  toWin={this.state.toWin}
                  wagerAmount={this.state.wagerAmount}
                  couldWin={this.state.couldWin}
                  couldProfit={this.state.couldProfit}
                />
              </Card>
            </div>
            <ScrollLink to="betExplanation" smooth offset={-50} duration={500}>
              <div className="scrollBtn scrollUpBtn">
                <ArrowUp style={arrowUpStyle} />
              </div>
            </ScrollLink>
          </div>
        </div>
      </div>
    );
  }
}
