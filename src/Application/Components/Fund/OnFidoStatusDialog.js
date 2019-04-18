// @flow

import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

type OnFidoStatusDialogProps = {
  open: boolean,
  user: User,
  fund: Fund,
  size: number,
  history: {
    push: () => void
  },
  handleClose: () => void
};

export default class OnFidoStatusDialog extends Component<
  OnFidoStatusDialogProps
> {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  onConfirm() {
    if (!this.props.user.balance) {
      this.props.history.push("/account/deposit");
      return;
    }
    if (
      this.props.user.documentStatus === "FAIL" ||
      this.props.user.documentStatus === undefined
    ) {
      this.props.history.push(`/account/verify-document#${this.props.fund.id}`);
    }
    this.handleClose();
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    const user = this.props.user;

    const dialogTitleStyle = {
      textAlign: "center"
    };

    const dialogCopyStyle = {
      textAlign: "center"
    };

    const buttonContainerStyle = {
      position: "absolute",
      bottom: 15,
      left: "50%",
      transform: "translateX(-50%)",
      width: "200px",
      textAlign: "center"
    };

    const buttonStyle = {
      position: "relative",
      display: "block"
    };

    const modalStyle = {
      width: this.props.size > 340 ? 350 : 310
    };

    const renderTitle = () => {
      if (!user.balance) {
        return "Deposit";
      }
      switch (user.documentStatus) {
        case undefined:
          return "Verify";
        case "FAIL":
          return "Re-Verify";
        case "RETRY":
          return "Verifying ID";
        default:
          return null;
      }
    };

    const renderCopy = () => {
      if (!user.balance) {
        return (
          <div>
            There is $0 in your account. <br />Please deposit.
          </div>
        );
      }
      switch (user.documentStatus) {
        case undefined:
          return (
            <div>
              This is your first wager. <br />Please upload an ID.
            </div>
          );
        case "FAIL":
          return (
            <div>
              We were unable to verify your ID. <br />Please try re-uploading.
            </div>
          );
        case "RETRY":
          return (
            <div>
              We are verifying your ID. <br />This could take a few moments.
            </div>
          );
        default:
          return null;
      }
    };

    const renderActionLabel = () => {
      if (!user.balance) {
        return "Deposit";
      }
      if (user.documentStatus === "FAIL" || user.documentStatus === undefined) {
        return "Verify";
      }
      return "OK";
    };

    const actions = [
      <RaisedButton
        key={0}
        label={renderActionLabel()}
        style={buttonStyle}
        disabled={this.state.disabled}
        primary
        fullWidth
        onClick={() => {
          this.onConfirm();
        }}
      />,
      <FlatButton
        key={1}
        label="CANCEL"
        style={buttonStyle}
        primary
        fullWidth
        onClick={() => {
          this.handleClose();
        }}
      />
    ];

    return (
      <Dialog
        title={renderTitle()}
        titleStyle={dialogTitleStyle}
        actions={actions}
        actionsContainerStyle={buttonContainerStyle}
        modal
        open={this.state.open}
        onRequestClose={() => {
          this.handleClose();
        }}
        bodyStyle={{ minHeight: 100, overflowX: "hidden" }}
        contentStyle={modalStyle}
        paperProps={{ style: { minHeight: 240 } }}
        style={{ overflowY: "scroll" }}
      >
        <div style={dialogCopyStyle}>{renderCopy()}</div>
      </Dialog>
    );
  }
}
