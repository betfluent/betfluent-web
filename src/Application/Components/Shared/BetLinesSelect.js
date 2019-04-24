// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { mgAppTheme } from "../ManagerStyles";
import Game from "../../Models/Game";
import Bet from "../../Models/Bet";

const textColor2 = mgAppTheme.palette.text.secondary;
const themeColorLight = mgAppTheme.palette.primary.light;

type BetLinesSelectProps = {
  game: Game,
  selectLine: (line: {}) => void
};

export default class BetLinesSelect extends Component<BetLinesSelectProps> {
  constructor(props) {
    super(props);
    this.selected = null;
  }

  renderEmptyMessage() {
    const emptyMessage = `No betting lines have been posted for this game`;

    return (
      <Typography variant="subheading" style={{ margin: 48 }}>
        {emptyMessage}
      </Typography>
    );
  }

  render() {
    const game = this.props.game;
    const lines = this.props.game.lines;

    if (!lines) return this.renderEmptyMessage();

    return (
      <MuiThemeProvider theme={mgAppTheme}>
        <div>
          <h2 style={{ marginTop: 16 }}>{game.description}</h2>
          <h3>
            {moment(game.scheduledTimeUnix).format(
              "ddd, MMM DD, YYYY @ hh:mm a"
            )}
          </h3>

          <div className="flexContainer gameLines">
            {Object.keys(lines)
              .map(lineId => lines[lineId])
              .sort((a, b) => {
                if (a.type === "MONEYLINE" && b.type !== "MONEYLINE") {
                  return -1;
                }
                if (a.type === "OVER_UNDER" && b.type !== "OVER_UNDER") {
                  return 1;
                }
                return a.type.localeCompare(b.type, "en", {
                  ignorePunctuation: true
                });
              })
              .map((line, index) => {
                const bet = new Bet(line);

                return (
                  <Paper
                    key={index}
                    className="gameLine"
                    style={{
                      backgroundColor:
                        this.selected === index ? themeColorLight : "#fff"
                    }}
                    onClick={() => {
                      this.selected = index;
                      this.props.selectLine(line);
                    }}
                  >
                    {
                      <div>
                        <p>{bet.summary()}</p>
                        <p style={{ color: textColor2 }}>{bet.explanation()}</p>
                      </div>
                    }
                  </Paper>
                );
              })}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
