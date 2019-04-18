// @flow

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TooltipIcon from "@material-ui/icons/Help";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { mgAppTheme, mgMuiTheme } from "../ManagerStyles";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor2 = mgMuiTheme.palette.textColor2;

type TooltipDrawerProps = {
  field: string,
  isTraining: boolean,
  fundName: string
};

export default class TooltipDrawer extends Component<TooltipDrawerProps> {
  state = {
    open: true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  renderTips = field => {
    switch (field) {
      case "init":
        return "Click on any field to see tips about it.";
      case "Pool Name":
        return (
          <div>
            <div>
              Choose a pool name that will attract users and get them excited!
            </div>
          </div>
        );
      case "League":
        return (
          <div>
            <div>
              Select a sports league. This is the only sport you will be able to
              bet on for this pool.
            </div>
            <div>Consider choosing the sport you specialize in.</div>
          </div>
        );
      case "Pool Type":
        return (
          <div>
            <div>
              Different Pool types allow users to understand the timeline of the
              pool and bets placed.
            </div>
            <div>
              <span>Daily</span>: The game(s) you are placing bets on start on
              the same day.
            </div>
            <div>
              <span>Weekly</span>: The game(s) you are placing bets on start in
              the same week.
            </div>
            <div>
              <span>Futures</span>: The game(s) you are placing bets on start
              one week after the pool is finished accepting money.
            </div>
          </div>
        );
      case "Min Wager":
        return "The minimum amount a user can wager on this pool.";
      case "Max Wager":
        return "The maximum amount a user can wager on this pool.";
      case "Pool Cap":
        return "The total amount of money a pool can accept. When a pool reaches its cap users will no longer be able to wager on it.";
      case "% Fee Charged":
        return "Betfluent charges 15% of user profit.";
      case "Pool Date/Time":
        return (
          <div>
            <div>Select a date to wager on games.</div>
          </div>
        );
      case "Potential Games":
        return "Choose one or more games you will place bets on. These selections will be displayed to users in the pool summary on the next page.";
      case "Pool Summary":
        return "Showcase your knowledge and creativity to draw users to your pool. Hook them, show them value and convince them to wager. You are constantly competing against other betting managers. Good Luck!";
      default:
        return null;
    }
  };

  renderTraningTips = field => {
    switch (field) {
      case "init":
        return (
          <div>
            <div>
              Welcome to your training pool. This first time, most of the fields
              are pre-populated, you only have to <span>choose a league</span>
            </div>
            <div>Click on any pool to see tips about it.</div>
          </div>
        );
      case "Pool Name":
        return (
          <div>
            <div>
              <span>{this.props.fundName}</span> is the training pool name.
            </div>
            <div>
              In the future choose a pool name that will attract users and get
              them excited!
            </div>
          </div>
        );
      case "Pool Date/Time":
        return (
          <div>
            <div>
              Trainings pools have a set time frame so these dates will also be
              pre-populated. This pool will not be visible to users and{" "}
              <span>you will have 15 days to place 10 bets.</span>
            </div>
            <div>
              The available games that you can bet on are between the selected
              pool closing and returning times. These games will populate on the
              next screen.
            </div>
          </div>
        );
      case "Pool Summary":
        return (
          <div>
            <div>
              Showcase your knowledge and creativity to draw users to your pool.
              Hook them, show them value and convince them to wager. You are
              constantly competing against other betting managers. Good Luck!
            </div>
            <div style={{ marginTop: 24 }}>
              <span>
                Training pools start with 1,000 simulated dollars for you to bet
                with.
              </span>
            </div>
          </div>
        );
      default:
        return this.renderTips(field);
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={mgAppTheme}>
        <div>
          <IconButton
            title="Tips"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            style={{
              position: "absolute",
              top: 8,
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
                padding: "0 8px"
              }}
            >
              <div style={{ marginLeft: 16, fontWeight: 500 }}>Tips</div>
              <IconButton
                onClick={this.handleDrawerClose}
                style={{ color: themeColor }}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
            <Divider />
            <div style={{ margin: "16px 24px", textAlign: "left" }}>
              {this.props.field && this.props.field !== "init" ? (
                <div style={{ marginBottom: 12 }}>{this.props.field}</div>
              ) : null}
              <div className="fundCreationTips" style={{ color: textColor2 }}>
                {this.props.isTraining
                  ? this.renderTraningTips(this.props.field)
                  : this.renderTips(this.props.field)}
              </div>
            </div>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}
