import React, { Component } from "react";
import Lottie from "react-lottie";
import { getFundBets } from "../../../Services/ManagerService";
import { getFundFeed } from "../../../Services/DbService";
import Game from "./Game";
import * as spinner from "../../../../Assets/spinner.json";
import { mgMuiTheme } from "../../ManagerStyles";

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

const desktopBreakpoint = mgMuiTheme.palette.desktopBreakpoint;

export default class GameDetail extends Component {
  constructor(props) {
    super(props);
    this.fundId = props.match.params.fund;
    this.onFundChange = this.onFundChange.bind(this);
  }

  componentWillMount() {
    this.fundFeed = getFundFeed(this.fundId, this.onFundChange);
  }

  componentWillUnmount() {
    if (this.fundFeed) this.fundFeed.off();
  }

  onFundChange(fund) {
    if (
      fund.status === "STAGED" ||
      fund.status === "OPEN" ||
      fund.status === "PENDING"
    ) {
      getFundBets(fund.id).then(bets => {
        const games = fund.games || {};
        const pendingBets = {};
        bets.forEach(bet => {
          if (bet.status !== "CANCELED") {
            games[bet.gameId] = bet.gameLeague.toLowerCase();
            pendingBets[bet.id] = bet.wagered || bet.pctOfFund;
          }
        });
        fund.games = games;
        fund.pendingBets = pendingBets;
        this.setState({ fund });
      });
    } else {
      this.setState({ fund });
    }
  }

  render() {
    if (!this.state) return null;
    if (!this.props.user)
      return (
        <div style={{ padding: "8px 0" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );

    const wagerStyle = {
      position: "relative",
      paddingLeft: 100,
      paddingRight: 100
    };

    if (this.props.size < desktopBreakpoint) {
      wagerStyle.paddingLeft = 5;
      wagerStyle.paddingRight = 5;
    }

    const userWager = this.state.fund.amountWagered / 100;
    return (
      <Game
        size={this.props.size}
        fund={this.state.fund}
        gameId={this.props.match.params.game}
        userWager={userWager}
        history={this.props.history}
        league={this.state.fund.league}
      />
    );
  }
}
