// @flow

import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import Dots from "material-ui-dots";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "./Styles";
import browseLobby from "../../Assets/browse_lobby.png";
import placeBet from "../../Assets/place_bet.png";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;

type TourDialogProps = {
  open: boolean,
  seenTour: boolean
};

export default class TourDialog extends Component<TourDialogProps> {
  constructor(props) {
    super(props);
    this.handleNext = this.handleNext.bind(this);
    this.state = {
      open: props.open,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  handleNext() {
    const index = this.state.index + 1;
    if (index > 2) {
      this.props.seenTour();
    } else {
      this.setState({ index });
    }
  }

  render() {
    const titleStyle = {
      textAlign: "center",
      fontSize: 20,
      lineHeight: "28px",
      fontWeight: 500,
      color: textColor1,
      paddingTop: 24
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor3
    };

    const buttonContainerStyle = {
      position: "absolute",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      padding: 0,
      width: 150
    };

    const buttonStyle = {
      display: "block"
    };

    const modalStyle = {
      width: 350
    };

    const dotWrapper = {
      position: "absolute",
      bottom: 100,
      left: "50%",
      transform: "translateX(-50%)"
    };

    const iconStyle = {
      height: 88,
      display: "block",
      margin: "32px auto"
    };

    const contentArray = [
      {
        text: "EXPLORE THE LOBBY AND CHOOSE A POOL",
        icon: <img src={browseLobby} alt="Browse Lobby" style={iconStyle} />
      },
      {
        text: "BETS ARE PLACED AFTER POOLS CLOSE",
        icon: <img src={placeBet} alt="Place Bet" style={iconStyle} />
      },
      {
        text: "VIEW THE BETS AND FOLLOW THE ACTION",
        icon: <img src={``} alt="Follow Bet" style={iconStyle} />
      }
    ];

    const actions = [
      <RaisedButton
        key={0}
        label={this.state.index === 2 ? "DONE" : "NEXT"}
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.handleNext}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          <Dialog
            contentClassName="dialogContent"
            title="Welcome to Betfluent"
            titleStyle={titleStyle}
            actions={actions}
            actionsContainerStyle={buttonContainerStyle}
            modal
            open={this.state.open}
            contentStyle={modalStyle}
            paperClassName="dialogPaper"
          >
            <div style={{ textAlign: "center" }}>
              <div style={subtitleStyle}>
                {contentArray[this.state.index].text}
              </div>
              {contentArray[this.state.index].icon}
              <div style={dotWrapper}>
                <Dots
                  index={this.state.index}
                  count={3}
                  onDotClick={index => this.setState({ index })}
                  dotColor={themeColor}
                />
              </div>
            </div>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
