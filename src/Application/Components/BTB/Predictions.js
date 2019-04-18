// @flow

import React, { Component } from "react";
import EmptyWork from "material-ui/svg-icons/action/work";
import Prediction from "./Prediction";
import User from "../../Models/User";
import Game from "../../Models/Game";
import Bet from "../../Models/Bet";
import {
  getUserPredictionsFeed,
  getBet,
  getGame,
  getManager
} from "../../Services/DbService";

type PredictionsProps = {
  user: User,
  size: number
};

type PredictionsState = {
  predictions: { betId: string, willWin: boolean }[],
  allBets: Bet[],
  allGames: Game[]
};

export default class Predictions extends Component<
  PredictionsProps,
  PredictionsState
> {
  constructor(props) {
    super(props);
    this.renderPredictions = this.renderPredictions.bind(this);
    this.onPredictionsChange = this.onPredictionsChange.bind(this);
    this.returnedFunds = [];
    this.state = {
      userReturns: props.user.returns
    };
  }

  componentDidMount() {
    this.userPredictionsFeed = getUserPredictionsFeed(
      this.props.user.publicId,
      this.onPredictionsChange
    );
  }

  componentWillUnmount() {
    if (this.userPredictionsFeed) this.userPredictionsFeed.off();
  }

  onPredictionsChange(predictions) {
    const managerIds = [];
    const gameIds = [];
    if (predictions.length > 0) {
      const bets = predictions.map(prediction => getBet(prediction.betId));
      Promise.all(bets).then(allBets => {
        const managerPromises = [];
        const gamePromises = [];
        allBets.forEach(bet => {
          if (!managerIds.includes(bet.managerId)) {
            managerPromises.push(getManager(bet.managerId));
            managerIds.push(bet.managerId);
          }
          if (!gameIds.includes(bet.gameId)) {
            gamePromises.push(getGame(bet.gameLeague, bet.gameId));
            gameIds.push(bet.gameId);
          }
        });
        Promise.all(
          [managerPromises, gamePromises].map(promises => Promise.all(promises))
        ).then(([allManagers, allGames]) => {
          this.setState({ predictions, allManagers, allGames, allBets });
        });
      });
    }
  }

  renderPredictions() {
    const { predictions, allManagers, allGames, allBets } = this.state;
    const filterAndFindId = (array, id) =>
      array
        .filter(element => element !== null)
        .find(element => element.id === id);

    return predictions
      .map((prediction, i) => {
        const bet = filterAndFindId(allBets, prediction.betId);
        const manager = filterAndFindId(allManagers, bet.managerId);
        const game = filterAndFindId(allGames, bet.gameId);
        return (
          <Prediction
            key={i}
            manager={manager}
            game={game}
            bet={bet}
            prediction={prediction}
            size={this.props.size}
          />
        );
      })
      .reverse();
  }

  render() {
    if (
      !this.state ||
      !this.state.allGames ||
      this.state.allGames.length === 0 ||
      !this.state.allBets ||
      this.state.allBets.length === 0
    ) {
      return (
        <div className="emptyPortfolio">
          <EmptyWork />
          <p>
            No predictions. <br />
            Try playing Beat the Bettor in your next wager.
          </p>
        </div>
      );
    }

    return (
      <div className="tabContent PortfolioCards">
        {this.renderPredictions()}
      </div>
    );
  }
}
