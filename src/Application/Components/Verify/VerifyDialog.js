// @flow

import React, { Component } from "react";
import ReactGA from "react-ga";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Lottie from "react-lottie";
import { gMuiTheme } from "../Styles";
import * as verifySuccess from "./verify_success.json";
import * as verifyError from "./verify_error.json";

type VerifyDialogProps = {
  verifyDialogOpen: boolean,
  handleClose: () => void,
  gotoDeposit: () => void,
  gotoLobby: () => void,
  goBackToFund: () => void,
  onFidoCheck: boolean,
  loading: boolean,
  pending: boolean,
  success: boolean,
  failMsg: string,
  failMsg2: string,
  loadingTitle: string,
  loadingMsg: string,
  loadinglottieFile: {},
  pendingTitle: string,
  pendingMsg: string,
  pendinglottieFile: {}
};

export default class VerifyDialog extends Component<VerifyDialogProps> {
  constructor(props) {
    super(props);
    this.handleFailure = this.handleFailure.bind(this);
    this.gotoDeposit = this.gotoDeposit.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.state = {
      verifyDialogOpen: props.verifyDialogOpen
    };
  }

  componentWillMount() {
    if (this.props.loading) {
      this.setState({ loadingMsg: "" });
      this.renderLoadingMsg();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ verifyDialogOpen: nextProps.verifyDialogOpen });
    if (nextProps.loading) {
      this.setState({ loadingMsg: "" });
      this.renderLoadingMsg();
    }
  }

  onRequestClose(button) {
    if (button) return;
    this.props.gotoLobby();
  }

  handleFailure() {
    if (this.props.pending === false) {
      this.props.handleClose();
      window.location.reload();
    }
    this.props.handleClose();
  }

  gotoDeposit(amount) {
    this.props.gotoDeposit(amount);
  }

  renderLoadingMsg = () => {
    setTimeout(() => {
      const loadingMsg = this.props.loadingMsg;
      this.setState({ loadingMsg });
    }, 15000);
  };

  renderDialogContent = () => {
    const loadingOptions = {
      loop: true,
      autoplay: true,
      animationData: this.props.loadinglottieFile
    };

    const pendingOptions = {
      loop: true,
      autoplay: true,
      animationData: this.props.pendinglottieFile
    };

    const verifySuccessOptions = {
      loop: true,
      autoplay: true,
      animationData: verifySuccess
    };

    const verifyErrorOptions = {
      loop: false,
      autoplay: true,
      animationData: verifyError
    };

    if (this.props.loading) {
      if (this.props.pending) {
        setTimeout(() => {
          this.props.gotoLobby();
        }, 3000);
      }
      return (
        <div>
          <div style={{ textAlign: "center" }}>
            {this.props.pending
              ? "This may take a few moments. You can view the lobby while you wait."
              : this.state.loadingMsg}
          </div>
          <div
            className="flexVertical"
            style={{ height: 200, justifyContent: "center" }}
          >
            <Lottie options={loadingOptions} />
          </div>
        </div>
      );
    }

    if (this.props.success && this.props.pending) {
      return (
        <div>
          <div style={{ textAlign: "center" }}>{this.props.pendingMsg}</div>
          <div
            className="flexVertical"
            style={{ height: 200, justifyContent: "center" }}
          >
            <Lottie options={pendingOptions} />
          </div>
        </div>
      );
    }

    if (this.props.success && !this.props.pending) {
      if (!this.props.onFidoCheck) {
        const amount = window.location.hash.replace("#", "");
        setTimeout(() => {
          this.gotoDeposit(amount);
        }, 3000);
      } else {
        setTimeout(() => {
          this.props.goBackToFund();
        }, 3000);
      }
      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ marginTop: 24 }} />
          <Lottie options={verifySuccessOptions} width={100} />
        </div>
      );
    }

    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 10 }}>{this.props.failMsg}</div>
        <Lottie options={verifyErrorOptions} width={100} />
        <div>{this.props.failMsg2}</div>
      </div>
    );
  };

  render() {
    const wagerTitleStyle = {
      textAlign: "center",
      fontSize: 20,
      lineHeight: "28px",
      fontWeight: 500
    };

    const buttonContainerStyle = {
      position: "absolute",
      bottom: 10,
      left: "50%",
      transform: "translateX(-50%)",
      width: "200px",
      textAlign: "center"
    };

    const buttonStyle = {
      display: "block"
    };

    const actions = [
      <RaisedButton
        key={0}
        label="OK"
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.handleFailure}
      />,
      <div key={1} style={{ position: "relative", top: -36 }}>
        Redirecting back to{" "}
        {this.props.onFidoCheck ? "the Fund" : "your Deposit"}...
      </div>,
      <RaisedButton
        key={2}
        label="Got it"
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.props.goBackToFund}
      />,
      <div key={3} style={{ position: "relative", top: -16 }}>
        Redirecting back to Lobby...
      </div>
    ];

    const renderActions = () => {
      if (!this.props.loading && !this.props.success) return actions[0];
      if (this.props.success && !this.props.pending) return actions[1];
      if (this.props.success && this.props.pending) return actions[2];
      if (this.props.loading && this.props.pending) return actions[3];
      return null;
    };

    const renderDialogTitle = () => {
      if (this.props.loading) {
        return this.props.loadingTitle;
      }
      if (this.props.pending) {
        return this.props.pendingTitle;
      }
      if (this.props.success) {
        return "You have been verified";
      }
      return "You have not been verified";
    };

    if (
      this.state.verifyDialogOpen &&
      !this.props.loading &&
      !this.props.success
    ) {
      ReactGA.modalview("verificationFailureModal");
    }

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Dialog
          contentClassName="dialogContent"
          title={renderDialogTitle()}
          titleStyle={wagerTitleStyle}
          actions={renderActions()}
          actionsContainerStyle={buttonContainerStyle}
          modal={!this.props.success}
          open={this.state.verifyDialogOpen}
          paperProps={{ style: { height: 332 } }}
          onRequestClose={this.onRequestClose}
        >
          {this.renderDialogContent()}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
