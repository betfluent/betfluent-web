// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { updateManagerDetails } from "../../Services/DbService";
import { mgMuiTheme } from "../ManagerStyles";

const alertColor = mgMuiTheme.palette.alertColor;

type EditSummaryDialogProps = {
  isDialogOpen: boolean,
  managerId: string,
  summary: string,
  handleClose: () => void
};

export default class EditSummaryDialog extends Component<
  EditSummaryDialogProps
> {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.saveSummary = this.saveSummary.bind(this);
    this.state = {
      isDialogOpen: props.isDialogOpen,
      summary: props.summary
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDialogOpen) {
      this.setState({ isDialogOpen: nextProps.isDialogOpen });
    }
    if (nextProps.summary) {
      this.setState({ summary: nextProps.summary });
    }
  }

  onSummaryInput(e) {
    const summary = e.target.value;
    if (summary.length > 500) {
      this.setState({ summaryError: "500 characters max" });
    } else {
      this.setState({ summaryError: null });
    }
    this.setState({ summary });
  }

  saveSummary() {
    const updates = {
      summary: this.state.summary
    };

    updateManagerDetails(this.props.managerId, updates)
      .then(() => {
        window.setTimeout(() => {
          this.handleClose();
        }, 1000);
      })
      .catch(summaryError => {
        this.setState({ summaryError });
      });
    return null;
  }

  handleClose() {
    this.setState({ isDialogOpen: false });
    this.props.handleClose();
  }

  render() {
    const wagerTitleStyle = {
      textAlign: "center"
    };

    const buttonContainerStyle = {
      width: 200,
      margin: "auto"
    };

    const buttonStyle = {
      display: "block"
    };

    const modalStyle = {
      width: 350
    };

    const errorStyle = {
      textAlign: "left",
      top: -5,
      color: alertColor
    };

    const actions = [
      <RaisedButton
        key={0}
        label="SAVE"
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.saveSummary}
      />,
      <FlatButton
        key={1}
        label="Cancel"
        primary
        fullWidth
        style={buttonStyle}
        onClick={this.handleClose}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <Dialog
          title="Edit your Profile"
          titleStyle={wagerTitleStyle}
          actions={actions}
          actionsContainerStyle={buttonContainerStyle}
          modal
          open={this.state.isDialogOpen}
          onRequestClose={this.handleClose}
          contentStyle={modalStyle}
          paperProps={{ style: { minHeight: 300, paddingBottom: 24 } }}
          style={{ overflowY: "scroll" }}
        >
          <TextField
            id="summary"
            multiLine
            fullWidth
            rows={3}
            floatingLabelShrinkStyle={{
              transform: "scale(0.75) translate(0px, -4px)"
            }}
            textareaStyle={{
              border: "1px solid rgb(178,178,178)",
              borderRadius: 3,
              padding: 4
            }}
            ref={summary => {
              this.summary = summary;
            }}
            className="formTextAreaStyle"
            floatingLabelText="Summary"
            value={this.state.summary}
            errorText={this.state.summaryError}
            errorStyle={errorStyle}
            onInput={e => this.onSummaryInput(e)}
          />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
