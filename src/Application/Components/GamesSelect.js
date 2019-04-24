// @flow
/* eslint-disable */

import React, { Component } from "react";
import moment from "moment";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import V0MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import Team from "./Fund/Team";
import { mgAppTheme, mgMuiTheme } from "./ManagerStyles";
import Game from "../Models/Game";
import {
  getGame,
  getGames,
  getGamesWithLines
} from "../Services/ManagerService";

const themeColor = mgAppTheme.palette.primary.main;
const themeColorLight = mgAppTheme.palette.primary.light;

type GameItemProps = {
  game: Game,
  isSelected: boolean,
  onClick: () => void
};

const GameItem = ({ game, isSelected, onClick }: GameItemProps) => (
  <Paper
    className="gameChoice"
    style={{
      backgroundColor: isSelected ? themeColorLight : "#fff"
    }}
    onClick={onClick}
  >
    <div className="flexContainer" style={{ alignItems: "center" }}>
      <div>
        <div className="flexContainer teamInfo">
          <Team game={game} team={game.awayTeam.id} noName iconSize={24} />
          <Typography>{game.awayTeam.name}</Typography>
        </div>
        <div className="flexContainer teamInfo">
          <Team game={game} team={game.homeTeam.id} noName iconSize={24} />
          <Typography>{game.homeTeam.name}</Typography>
        </div>
      </div>
      <div>
        <Typography align="center">
          {moment(game.scheduledTimeUnix).format("MM/DD")}
        </Typography>
        <Typography align="center">
          {moment(game.scheduledTimeUnix).format("h:mm A")}
        </Typography>
      </div>
    </div>
  </Paper>
);

type GamesSelectProps = {
  title?: string,
  subtitle?: string,
  league: string,
  fromTimeMillis?: number,
  toTimeMillis?: number, // eslint-disable-line react/require-default-props
  betLinesRequired?: boolean,
  numberToSelect?: number,
  preselectedIds?: [string],
  onBackPressed: () => void,
  onConfirmSelection: (games: [Game]) => void
};

type GamesSelectState = {
  gamesByDate?: { [date: string]: [Game] },
  selectedGames: [Game],
  toTimeMillis: number
};

export default class GamesSelect extends Component<
  GamesSelectProps,
  GamesSelectState
> {
  static defaultProps = {
    title: "Select Games",
    subtitle: "When you are done, click NEXT below",
    fromTimeMillis: Date.now(),
    betLinesRequired: false,
    numberToSelect: Number.MAX_SAFE_INTEGER,
    preselectedIds: []
  };

  constructor(props) {
    super(props);
    this.toggleSelectGame = this.toggleSelectGame.bind(this);
    this.state = {
      selectedGames: []
    };
  }

  componentDidMount() {
    const selectedGames = this.state.selectedGames;
    const gameFunction = this.props.betLinesRequired
      ? getGamesWithLines
      : getGames;

    if (!this.props.games) {
      gameFunction(this.props.league, {
        fromTimeMillis: this.props.gameDate
      })
        .then(games => {
          return games.reduce((gamesByDate, game) => {
            if (this.props.preselectedIds.includes(game.id)) {
              selectedGames.push(game);
            }
            const date = moment(game.scheduledTimeUnix).format("MM/DD/YY");
            // eslint-disable-next-line no-param-reassign
            if (!gamesByDate[date]) gamesByDate[date] = [];
            gamesByDate[date].push(game);
            return gamesByDate;
          }, {});
        })
        .then(gamesByDate => {
          this.setState({ gamesByDate, selectedGames });
        });
    } else {
      Promise.all(
        this.props.games.map(gameId => getGame(this.props.league, gameId))
      )
        .then(games => {
          return games.reduce((gamesByDate, game) => {
            if (this.props.preselectedIds.includes(game.id)) {
              selectedGames.push(game);
            }
            const date = moment(game.scheduledTimeUnix).format("MM/DD/YY");
            // eslint-disable-next-line no-param-reassign
            if (!gamesByDate[date]) gamesByDate[date] = [];
            gamesByDate[date].push(game);
            return gamesByDate;
          }, {});
        })
        .then(gamesByDate => {
          this.setState({ gamesByDate, selectedGames });
        });
    }
  }

  toggleSelectGame(game) {
    const numberToSelect = this.props.numberToSelect;
    const selectedGames = this.state.selectedGames;

    if (selectedGames.includes(game)) {
      const index = selectedGames.indexOf(game);
      selectedGames.splice(index, 1);
    } else if (selectedGames.length === numberToSelect) {
      selectedGames.shift();
      selectedGames.push(game);
    } else {
      selectedGames.push(game);
    }
    this.setState({ selectedGames });
  }

  renderGamesByDate(gamesByDate) {
    const selectedGames = this.state.selectedGames;
    return (
      <div className="tabContent">
        {Object.keys(gamesByDate)
          .sort()
          .map(date => (
            <div key={date} className="potentialGames">
              <Typography align="left" style={{ marginTop: 24 }}>
                {date}
              </Typography>
              <div className="flexContainer">
                {gamesByDate[date]
                  .sort((g1, g2) => {
                    const sort = g1.scheduledTimeUnix - g2.scheduledTimeUnix;
                    if (sort !== 0) return sort;
                    if (g1.id > g2.id) return 1;
                    return -1;
                  })
                  .map(game => (
                    <GameItem
                      key={game.id}
                      game={game}
                      isSelected={selectedGames.includes(game)}
                      onClick={() => {
                        this.toggleSelectGame(game);
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    );
  }

  renderEmptyMessage() {
    const { league } = this.props;
    const fromFormatted = moment(this.props.gameDate).format("MM/DD/YYYY");
    const emptyMessage = `No ${
      this.props.betLinesRequired
        ? `betting lines have been posted for ${league} games`
        : `${league} games are scheduled`
    } on ${fromFormatted}.`;

    return (
      <Typography variant="subheading" style={{ margin: 48 }}>
        {emptyMessage}
      </Typography>
    );
  }

  render() {
    const gamesByDate = this.state.gamesByDate;
    if (!gamesByDate) {
      return (
        <MuiThemeProvider theme={mgAppTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }
    const numberToSelect = this.props.numberToSelect;
    const selectedGames = this.state.selectedGames;
    return (
      <div
        style={{
          overflowY: "scroll",
          height: "100vh",
          padding: "24px 0",
          boxSizing: "border-box"
        }}
      >
        <Typography variant="title" gutterBottom>
          {this.props.title}
        </Typography>
        <Typography gutterBottom>{this.props.subtitle}</Typography>
        {Object.keys(gamesByDate).length
          ? this.renderGamesByDate(gamesByDate)
          : this.renderEmptyMessage()}
        <V0MuiThemeProvider muiTheme={mgMuiTheme}>
          <div style={{ marginTop: 24 }}>
            <RaisedButton
              label="Back"
              style={{ marginRight: 10 }}
              labelStyle={{ color: themeColor }}
              onClick={() => {
                this.props.onBackPressed();
              }}
            />
            <RaisedButton
              primary
              disabled={
                !selectedGames.length ||
                (numberToSelect !== Number.MAX_SAFE_INTEGER &&
                  numberToSelect > selectedGames.length)
              }
              label="Next"
              style={{ marginLeft: 10 }}
              onClick={() => {
                this.props.onConfirmSelection(this.state.selectedGames);
              }}
            />
          </div>
        </V0MuiThemeProvider>
      </div>
    );
  }
}
