// @flow
/* eslint-disable */

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import V0MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import GamesSelect from "../GamesSelect";
import {
  getNewUid,
  getFund,
  getGame,
  getFundDetails
} from "../../Services/DbService";
import { placeBet, getFundBets } from "../../Services/ManagerService";
import { mgMuiTheme, mgAppTheme } from "../ManagerStyles";
import BetLinesSelect from "../Shared/BetLinesSelect";
import BetsDrawer from "./BetsDrawer";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const alertColor = mgMuiTheme.palette.alertColor;

type DialogProps = {
  placeBet: () => {},
  handleClose: () => void,
  confirmBet: () => {},
  type: string,
  selection: string,
  points: number,
  returning: nnumber,
  overUnder: string,
  fund: Fund,
  wagered: number,
  wagerPct: number
};

const RenderDialog = (props: DialogProps) => {
  const wagerTitleStyle = {
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

  const modalStyle = {
    width: 350
  };

  const betSummary = () => {
    if (props.type === "MONEYLINE") {
      return `${props.selection} (${props.returning})`;
    }

    if (props.type === "SPREAD") {
      return `${props.selection} ${props.points} (${props.returning})`;
    }

    return `${props.points} (${props.returning}) ${props.overUnder}`;
  };

  const actions = [
    <RaisedButton
      key={0}
      label="CONFIRM BET"
      style={buttonStyle}
      primary
      fullWidth
      onClick={props.placeBet}
    />,
    <FlatButton
      key={1}
      label="CANCEL"
      style={buttonStyle}
      labelStyle={{ color: alertColor }}
      fullWidth
      onClick={props.handleClose}
    />
  ];

  return (
    <Dialog
      title={"CONFIRM BET"}
      titleStyle={wagerTitleStyle}
      actions={actions}
      actionsContainerStyle={buttonContainerStyle}
      modal
      open={props.confirmBet}
      bodyStyle={{ height: 275, overflowX: "hidden" }}
      contentStyle={modalStyle}
      paperProps={{ style: { height: 275 } }}
      style={{ overflowY: "scroll" }}
    >
      <div>
        <div className="flexContainer">
          <div>Bet:</div>
          <div>
            <div>{betSummary()}</div>
            <div
              style={{ textAlign: "right", color: textColor1, fontWeight: 500 }}
            >
              {props.type ? props.type.replace("_", "/") : null}
            </div>
          </div>
        </div>
        <div className="flexContainer" style={{ marginTop: 12 }}>
          <div>Amount:</div>
          <div style={{ fontSize: 18, color: textColor1, fontWeight: 500 }}>
            {props.fund.status === "PENDING"
              ? `$${props.wagered}`
              : `${props.wagerPct}`}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

type PlaceBetProps = {
  user: User,
  location: {},
  history: {
    location: {
      hash: string
    },
    push: () => void,
    goBack: () => void
  },
  match: {
    params: {
      fund: string
    }
  }
};

export default class PlaceBet extends Component<PlaceBetProps> {
  constructor(props) {
    super(props);
    this.hash = this.props.history.location.hash;
    this.fundId = props.computedMatch.params.fund;
    this.onWagerChange = this.onWagerChange.bind(this);
    this.onWagerPctChange = this.onWagerPctChange.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.state = {
      potentialGames: [],
      gameSelected: null,
      confirmBet: false,
      bets: [],
      line: {},
      wagerPct: '100%'
    };
  }

  componentDidMount() {
    getFundDetails(this.fundId).then(details => {
      const potentialGames = details.potentialGames.map(game => game.id);
      this.setState({ potentialGames });
    });
    Promise.all([getFund(this.fundId), getFundBets(this.fundId)])
      .then(([fund, bets]) => {
        if (fund.status === "STAGED" || fund.status === "OPEN") {
          const percentBetted = Object.keys(bets)
            .map(key => bets[key])
            .map(bet => bet.pctOfFund)
            .reduce((t, i) => t + i, 0);
          const remainingPercent = 100 - percentBetted;
          this.setState({ fund, remainingPercent, bets });
        } else if (fund.status === "PENDING") {
          const amountBetted = Object.keys(bets)
            .map(key => bets[key])
            .filter(bet => bet.status === "STAGED")
            .map(bet => bet.wagered)
            .reduce((t, i) => t + i, 0);
          const remainingAmount = fund.balance - amountBetted;
          this.setState({ fund, remainingAmount, bets });
        }

        const gamePromiseMap = bets.reduce((map, bet) => {
          if (!map[bet.gameId]) {
            // eslint-disable-next-line no-param-reassign
            map[bet.gameId] = getGame(bet.gameLeague, bet.gameId);
          }
          return map;
        }, {});

        return Promise.all(
          Object.keys(gamePromiseMap).map(gameId => gamePromiseMap[gameId])
        );
      })
      .then(games => {
        const { bets } = this.state;
        const gamesWithBets = games.map(game => {
          // eslint-disable-next-line no-param-reassign
          game.bets = bets.filter(bet => bet.gameId === game.id);
          return game;
        });
        this.setState({ gamesWithBets });
      });
  }

  onWagerChange(e) {
    let wagered = e.target.value.replace(/,/gi, "");
    if (isNaN(Number(wagered))) {
      wagered = wagered.slice(0, -1);
    }
    let errorTextWagered;
    if (wagered * 100 > this.state.remainingAmount) {
      errorTextWagered = "Bet cannot be more than pool balance";
    } else {
      errorTextWagered = null;
    }
    this.setState({ wagered, errorTextWagered });
  }

  onWagerPctChange(e) {
    let wagerPct = e.target.value.replace(/%/gi, "");
    if (isNaN(Number(wagerPct))) {
      wagerPct = wagerPct.slice(0, -1);
    }
    let errorTextWagered;
    if (wagerPct > 100) {
      errorTextWagered = "Percentage cannot be greater than 100";
    } else if (wagerPct > this.state.remainingPercent) {
      errorTextWagered = "You cannot wager more than the remaining percentage";
    } else {
      errorTextWagered = null;
    }
    this.setState({ wagerPct: `${wagerPct}%`, errorTextWagered });
  }

  onWagerPctInput = input => {
    let wagerPct = this.state.wagerPct;
    if (input.keyCode === 8) {
      if (wagerPct.match(/%$/)) {
        wagerPct = wagerPct.slice(0, -1);
      }
      this.setState({ wagerPct });
    }
  };

  selectLine = (line, fade) => {
    this.setState({ line, fade, errorTextLine: null });
  };

  previewBet() {
    if (!Object.keys(this.state.line).length) {
      this.setState({ errorTextLine: "Please select a line." });
      return null;
    }
    this.setState({ errorTextLine: null });

    if (!this.state.wagered && this.state.fund.status === "PENDING") {
      this.setState({ errorTextWagered: "You must enter an amount!" });
      return null;
    }
    this.setState({ errorTextWagered: null });

    if (
      this.hash === "#staged" &&
      (!this.state.wagerPct ||
        isNaN(Number(this.state.wagerPct.slice(0, -1))) ||
        Number(this.state.wagerPct.slice(0, -1)) <= 0)
    ) {
      this.setState({
        errorTextWagered: "You must enter a percentage of the fund!"
      });
      return null;
    }
    this.setState({ errorTextWagered: null });

    this.setState({ confirmBet: true });
    return null;
  }

  handleClose = () => {
    const confirmBet = false;
    this.setState({ confirmBet });
  };

  placeBet() {
    const bet = {
      fundId: this.state.fund.id,
      gameId: this.state.gameSelected.id,
      gameLeague: this.state.gameSelected.league,
      managerId: this.props.user.managerId,
      status: "STAGED",
      line: this.state.line,
      fade: this.state.fade,
      pctOfFund: 100,
      wagered: 0
    };

    if (this.props.user.manager.isTraining) {
      bet.isTraining = true;
    }

    const betPayload = {
      id: getNewUid(),
      serviceType: "BET",
      deviceLocation: this.props.location,
      request: bet
    };

    placeBet(betPayload);

    this.setState({ betPlaced: true });
    window.setTimeout(() => {
      this.setState({ betPlaced: false });
      this.props.history.push(`/manage/pools/${this.state.fund.id}`);
    }, 1000);
    return null;
  }

  gameSelected(gameSelected) {
    this.setState({ gameSelected });
  }

  renderGameLines = game => {
    const rootStyle = {
      width: "100%"
    };

    const errorStyle = {
      textAlign: "left",
      color: alertColor,
      top: -5
    };

    return (
      <V0MuiThemeProvider muiTheme={mgMuiTheme}>
        <div>
          <div
            className="tabContent"
            style={{ color: textColor1, paddingBottom: 48 }}
          >
            <BetLinesSelect game={game} selectLine={this.selectLine} />
            <div style={{ marginTop: 48 }}>
              <RaisedButton
                style={{ marginRight: 10 }}
                label="CANCEL"
                onClick={() => {
                  this.gameSelected(null);
                  this.setState({
                    line: {},
                    wagered: null,
                    wagerPct: null,
                    errorTextLine: null,
                    errorTextWagered: null
                  });
                }}
                labelStyle={{ color: alertColor }}
              />
              <RaisedButton
                primary
                disabled={!game.lines}
                style={{ marginLeft: 10 }}
                label={"STAGE BET"}
                onClick={() => {
                  this.previewBet();
                }}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: this.state.betPlaced ? "block" : "none",
                  color: themeColor
                }}
              >
                Bet Placed
              </div>
              <div style={{ color: alertColor }}>
                {this.state.errorTextLine}
              </div>
            </div>
            <RenderDialog
              fund={this.state.fund}
              confirmBet={this.state.confirmBet}
              placeBet={this.placeBet}
              handleClose={this.handleClose}
              type={this.state.line.type}
              selection={this.state.line.selection}
              points={this.state.line.points}
              returning={this.state.line.returning}
              overUnder={this.state.line.overUnder}
              wagered={this.state.wagered}
              wagerPct={this.state.wagerPct}
            />
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  };

  render() {
    if (!this.state.fund || !this.state.potentialGames.length)
      return (
        <MuiThemeProvider theme={mgAppTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    const gameSelected = this.state.gameSelected;
    const fund = this.state.fund;
    const now = Date.now();

    const fromTimeMillis = Math.max(
      now,
      fund.closedTimeMillis !== -1
        ? fund.closedTimeMillis
        : fund.closingTime * 1000
    );

    const toTimeMillis =
      fund.returnTimeMillis === -1
        ? undefined
        : Math.max(now, fund.returnTimeMillis);

    return (
      <div>
        {!gameSelected ? (
          <GamesSelect
            subtitle="Choose a game to bet on, then click NEXT"
            games={this.state.potentialGames}
            league={fund.league}
            fromTimeMillis={fromTimeMillis}
            toTimeMillis={toTimeMillis}
            betLinesRequired
            numberToSelect={1}
            onBackPressed={() => {
              this.props.history.goBack();
            }}
            onConfirmSelection={games => {
              this.gameSelected(games[0]);
            }}
          />
        ) : (
          this.renderGameLines(gameSelected)
        )}
        {this.props.size > 624 &&
          <BetsDrawer
            fund={this.state.fund}
            gamesWithBets={this.state.gamesWithBets}
          />}
      </div>
    );
  }
}
