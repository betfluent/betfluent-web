// @flow
/* eslint-disable */

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { Card } from "material-ui/Card";
import ArrowUp from "material-ui/svg-icons/hardware/keyboard-arrow-up";
import * as Scroll from "react-scroll";
import { gMuiTheme } from "./../Styles";
import browseLobby from "../../../Assets/browse_lobby.png";
import placeBet from "../../../Assets/place_bet.png";
import LearningModalCard from "../LearningModalCard";
import Bet from "../../Models/Bet";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";

const ScrollLink = Scroll.Link;
const ScrollElement = Scroll.Element;

const themeColor = gMuiTheme.palette.themeColor;
const themeColorLight = gMuiTheme.palette.themeColorLight;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type BetProps = {
  size: number
};

type BetState = {
  betType: string,
  betDetail: string,
  toWin: string
};

export default class LandingPage extends Component<BetProps, BetState> {
  constructor() {
    super();
    this.selected = 0;
    this.state = {
      betType: "MONEYLINE",
      betDetail: "Los Angeles Lakers (+200)",
      wagerAmount: 100,
      couldWin: 300,
      couldProfit: 200,
      toWin: "Los Angeles Lakers must win. This is known as a Moneyline bet.",
      modalIndex: 0,
      modalHeader: "Sign-Up is Quick, Easy, Secure",
      modalText: "Explore the Lobby and Choose a Sport",
      colors: [themeColor, textColor3, textColor3]
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
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}

          <div
            className="guideCards"
            style={{ backgroundColor: "#f5f5f5", padding: "12px 0 0 0" }}
          >
            <div className="lpContent">
              <h1>How it Works</h1>
              <div className="flexVertical">
                <div className="guideCopies flexContainer">
                  <div className="guideCopyContainer">
                    <div className="guideIcon">
                      <img src={browseLobby} alt="Browse Lobby" />
                    </div>
                    <div className="guideCopy">
                      <h3>
                        Explore the Lobby<br />Choose a Sport
                      </h3>
                      <p>
                        Betting managers host different sports themed betting
                        pools — find one you love and make a wager.
                      </p>
                    </div>
                  </div>
                  <div className="guideCopyContainer">
                    <div className="guideIcon">
                      <img src={placeBet} alt="Place Bet" />
                    </div>
                    <div className="guideCopy">
                      <h3>
                        Bets are placed<br />after Pools close
                      </h3>
                      <p>
                        The manager decides what bets should be placed based on
                        the theme of the pool you choose.
                      </p>
                    </div>
                  </div>
                  <div className="guideCopyContainer">
                    <div className="guideIcon">
                      <img src={``} alt="Follow Bet" />
                    </div>
                    <div className="guideCopy">
                      <h3>
                        View the Bets<br />Follow the Action
                      </h3>
                      <p>
                        Receive notification of the bets before the start of the
                        game. Live scoring allows you to follow along in
                        real-time!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="betExplanation">
            <ScrollElement name="betExplanation" />
            <div className="lpContent">
              <h1>Sports Bets Explained</h1>
              <div className="explanationContainer">
                <div className="explanationText">
                  <div
                    className="explanationCopy"
                    style={{ color: textColor2 }}
                  >
                    Your favorite teams are playing tonight - it&apos;s time to
                    get some action on the game. You go to an online Sports Book
                    and you see bets like the ones below. &quot;What do all of
                    those numbers mean,&quot; you ask. That&apos;s where
                    we&apos;ve got your back.
                    <br />
                    <br />
                    Let&apos;s put $100 on the game. Click on any button below
                    for a clear explanation.
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
                          this.updateCard(
                            "Boston Celtics",
                            "MONEYLINE",
                            0,
                            -300
                          );
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
                          this.updateCard(
                            "Boston Celtics",
                            "SPREAD",
                            -5.5,
                            -110
                          );
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
                <ScrollLink
                  to="betExplanation"
                  smooth
                  offset={-50}
                  duration={500}
                >
                  <div className="scrollBtn scrollUpBtn">
                    <ArrowUp style={arrowUpStyle} />
                  </div>
                </ScrollLink>
              </div>
            </div>
          </div>

          <div className="faqBlock" style={{ backgroundColor: "#f5f5f5" }}>
            <div className="lpContent">
              <h1>FAQ</h1>
              <div style={{ color: textColor2 }}>
                <p>
                  For more answered questions, please click{" "}
                  <Link to="/faq" style={{ color: themeColor }}>
                    here
                  </Link>
                </p>
                <p>
                  Need help?{" "}
                  <Link to="/contactus" style={{ color: themeColor }}>
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
