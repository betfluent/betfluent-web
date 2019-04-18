// @flow

import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import { gMuiTheme } from "../Styles";
import Prediction from "../BTB/Prediction";

const textColor1 = gMuiTheme.palette.textColor1;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type PredicitonDialogProps = {
  openPredictionDialog: boolean,
  game: Game,
  bet: Bet,
  manager: Manager,
  willWin: boolean,
  size: number,
  handleClose: () => void
};

export default class PredicitonDialog extends Component<PredicitonDialogProps> {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      openPredictionDialog: props.openPredictionDialog
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ openPredictionDialog: nextProps.openPredictionDialog });
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    const action = (
      <RaisedButton
        key={0}
        label="Got it"
        primary
        fullWidth
        onClick={this.handleClose}
      />
    );

    const renderWidth = () => {
      if (this.props.size < 340) {
        return 280;
      } else if (this.props.size < mobileBreakPoint) {
        return 340;
      }
      return 420;
    };

    return (
      <Dialog
        className="predictionDialog"
        actions={action}
        actionsContainerStyle={{ width: "64%", margin: "auto", padding: 24 }}
        modal
        open={this.state.openPredictionDialog}
        onRequestClose={this.handleClose}
        bodyStyle={{ padding: 0 }}
        contentStyle={{ width: renderWidth() }}
        style={{ overflowY: "scroll" }}
      >
        <Prediction
          manager={this.props.manager}
          game={this.props.game}
          bet={this.props.bet}
          prediction={{ willWin: this.props.willWin }}
          size={this.props.size}
        />
        <div className="predictionDialogCopy">
          <div style={{ color: textColor1, fontSize: 16, fontWeight: 500 }}>
            So you want to Beat the Bettor?
          </div>
          <div style={{ fontSize: 14 }}>
            Check out the Compete tab for more.
          </div>
        </div>
      </Dialog>
    );
  }
}
