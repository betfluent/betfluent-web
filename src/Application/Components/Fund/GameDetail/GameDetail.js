// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Game from "./Game";
import { appTheme } from "../../Styles";
import { scrollComponent } from "../../Shared/Scroll";
import { getFundFeed } from "../../../Services/DbService";

const ScrollGame = scrollComponent(Game);

type GameDetailProps = {
  fund: Fund,
  computedMatch: {
    params: {
      fund: string,
      game: string
    }
  },
  size: number,
  history: {
    goBack: () => {}
  },
  user: User,
  location: {}
};

export default class GameDetail extends Component<GameDetailProps> {
  constructor(props) {
    super(props);
    this.fundId = props.computedMatch.params.fund;
    this.onFundChange = this.onFundChange.bind(this);
  }

  componentDidMount() {
    this.fundFeed = getFundFeed(this.fundId, this.onFundChange);
  }

  componentWillUnmount() {
    if (this.fundFeed) this.fundFeed.off();
  }

  onFundChange(fund) {
    this.setState({ fund });
  }

  render() {
    if (!this.state || !this.props.user) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    const userWager = this.props.user.investments[this.state.fund.id] / 100;

    return (
      <ScrollGame
        size={this.props.size}
        fund={this.state.fund}
        gameId={this.props.computedMatch.params.game}
        user={this.props.user}
        userWager={userWager}
        history={this.props.history}
        league={this.state.fund.league}
        location={this.props.location}
      />
    );
  }
}
