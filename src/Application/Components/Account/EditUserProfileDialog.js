// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { updatePublicUser, updateManager } from "../../Services/DbService";
import { gMuiTheme } from "../Styles";

const alertColor = gMuiTheme.palette.alertColor;
type EditUserProfileDialogProps = {
  managerId: String,
  isDialogOpen: boolean,
  publicUserId: string,
  publicName: string,
  handleClose: () => void
};

export default class EditUserProfileDialog extends Component<
  EditUserProfileDialogProps
> {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.savePublicName = this.savePublicName.bind(this);
    this.state = {
      isDialogOpen: props.isDialogOpen,
      publicName: props.publicName,
      publicNameError: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDialogOpen) {
      this.setState({ isDialogOpen: nextProps.isDialogOpen });
    }
    if (nextProps.publicName) {
      this.setState({ publicName: nextProps.publicName });
    }
  }

  onSummaryInput(e) {
    const publicName = e.target.value;
    if (publicName.length > 16) {
      this.setState({ publicNameError: "16 characters max" });
    } else {
      this.setState({ publicNameError: null });
    }
    this.setState({ publicName });
  }

  savePublicName() {
    const updates = {
      name: this.state.publicName
    };

    if (!!this.props.managerId) updateManager(this.props.managerId, updates);

    updatePublicUser(this.props.publicUserId, updates)
      .then(() => {
        window.setTimeout(() => {
          this.handleClose();
        }, 1000);
      })
      .catch(error => {
        this.setState({ publicNameError: error.message });
      });
    return null;
  }

  handleClose() {
    this.setState({ isDialogOpen: false, publicNameError: null });
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
        onClick={this.savePublicName}
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
      <MuiThemeProvider muiTheme={gMuiTheme}>
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
            id="publicName"
            fullWidth
            floatingLabelShrinkStyle={{
              transform: "scale(0.75) translate(0px, -4px)"
            }}
            textareaStyle={{
              border: "1px solid rgb(178,178,178)",
              borderRadius: 3,
              padding: 4
            }}
            ref={publicName => {
              this.publicName = publicName;
            }}
            className="formTextAreaStyle"
            floatingLabelText="Username"
            value={this.state.publicName}
            errorText={this.state.publicNameError}
            errorStyle={errorStyle}
            onInput={e => this.onSummaryInput(e)}
          />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
