// @flow
/* eslint-disable */

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TooltipIcon from "@material-ui/icons/Help";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import moment from "moment";
import { mgAppTheme } from "../ManagerStyles";

const themeColor = mgAppTheme.palette.primary.main;
const textColor2 = mgAppTheme.palette.text.secondary;

type BetsDrawerProps = {
  fund: Fund,
  gamesWithBets: [{ ...Game, bets: [Bet] }]
};

export default class BetsDrawer extends Component<BetsDrawerProps> {
  state = {
    open: true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  renderCurrentBets = () => {
    const { fund, gamesWithBets } = this.props;

    if (!gamesWithBets) {
      return (
        <MuiThemeProvider theme={mgAppTheme}>
          <div className="center-flex" style={{ marginTop: 48 }}>
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    if (!gamesWithBets.length) {
      return (
        <div className="currentBets">No bets placed on this Pool yet.</div>
      );
    }

    return gamesWithBets.map(game => {
      const gameStatus = () => {
        if (
          game.status === "scheduled" ||
          game.status === "created" ||
          game.status === "postponed"
        )
          return "Scheduled";
        if (game.status === "closed" || game.status === "finished")
          return "Final";
        return "Live";
      };

      return (
        <div key={game.id} className="currentBets">
          <Typography style={{ fontWeight: 500, fontSize: 14 }}>
            {game.description}
          </Typography>
          <div className="flexContainer">
            <Typography style={{ color: textColor2, fontSize: 12 }}>
              {moment(game.scheduledTimeUnix).format("MMM. Do @ hh:mm A")}
            </Typography>
            <div style={{ fontWeight: 500 }}>{gameStatus()}</div>
          </div>
          {game.bets.map(bet => {
            const amount =
              fund.status === "PENDING"
                ? `$${bet.wagered / 100}`
                : `${bet.pctOfFund}%`;

            return (
              <div key={bet.id} className="currentBet flexContainer noWrap">
                <div>{bet.summary()}</div>
                <div style={{ color: themeColor }}>{amount}</div>
              </div>
            );
          })}
          <Divider style={{ marginTop: 16 }} />
        </div>
      );
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={mgAppTheme}>
        <div>
          <IconButton
            title="Current Bets"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            style={{
              position: "absolute",
              top: 0,
              right: 8,
              color: themeColor
            }}
          >
            <TooltipIcon />
          </IconButton>
          <Drawer
            variant="persistent"
            anchor="right"
            open={this.state.open}
            PaperProps={{
              style: {
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 10px",
                width: 240
              }
            }}
          >
            <div
              className="flexContainer"
              style={{
                alignItems: "center",
                padding: "0 8px",
                height: 48
              }}
            >
              <div style={{ marginLeft: 16, fontWeight: 500 }}>
                Current Bets
              </div>
              <IconButton
                onClick={this.handleDrawerClose}
                style={{ color: themeColor }}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
            <Divider />
            <div style={{ overflowY: "scroll" }}>
              {this.renderCurrentBets()}
            </div>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}
