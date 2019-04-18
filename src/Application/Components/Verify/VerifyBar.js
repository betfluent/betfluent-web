// @flow

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from "material-ui/Snackbar";
import { Link } from "react-router-dom";
import { gMuiTheme } from "../Styles";

const themeColor = gMuiTheme.palette.themeColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

const titleStyle = {
  fontSize: 14,
  fontWeight: 500
};

type VerifyBarProps = {
  user: User,
  authUser: {
    emailVerified: boolean
  },
  size: number,
  history: {
    location: {
      pathname: string
    }
  }
};

export default class VerifyBar extends Component<VerifyBarProps> {
  static returnStateFromProps(props) {
    const requiresEmailVerify = props.authUser && !props.authUser.emailVerified;

    const requiresDocumentVerify =
      props.user &&
      (props.user.documentStatus === "RETRY" ||
        props.user.documentStatus === "FAIL");

    const isCurrentlyVerifying = props.history.location.pathname.includes(
      "verify"
    );

    const open =
      !isCurrentlyVerifying && (requiresEmailVerify || requiresDocumentVerify);

    return { open };
  }

  constructor(props) {
    super(props);
    this.state = VerifyBar.returnStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(VerifyBar.returnStateFromProps(nextProps));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.open !== nextState.open;
  }

  renderCopy = () => {
    if (this.props.authUser && !this.props.authUser.emailVerified) {
      return "Verify email address - check your inbox";
    }
    if (this.props.user && this.props.user.documentStatus === "FAIL") {
      return "Photo ID verification failed";
    }
    if (this.props.user && this.props.user.documentStatus === "RETRY") {
      return "We are re-checking your Photo ID...";
    }

    return null;
  };

  renderActionLabel = () => {
    if (this.props.user && this.props.user.documentStatus === "FAIL") {
      return "RETRY";
    }
    return null;
  };

  renderSnackbar = () => (
    <Snackbar
      style={{
        width: "100%",
        bottom: this.props.size < mobileBreakPoint ? 56 : 0
      }}
      bodyStyle={{
        width: "100%",
        maxWidth: "100vw",
        backgroundColor:
          this.props.user && this.props.user.documentStatus === "RETRY"
            ? "#888"
            : themeColor
      }}
      contentStyle={{
        width: "100%",
        maxWidth: 724,
        margin: "auto",
        textAlign: "left",
        fontSize: 12,
        lineHeight: "48px"
      }}
      open={this.state.open}
      onRequestClose={() => null}
      message={[
        <span key={100} style={titleStyle}>
          {this.renderCopy()}
        </span>,
        <span
          key={101}
          style={{ fontSize: 14, fontWeight: 500, float: "right" }}
        >
          <span style={{ color: "#fff" }}>{this.renderActionLabel()}</span>
        </span>
      ]}
    />
  );

  render() {
    if (!this.props.user && !this.props.authUser) return null;

    return (
      <MuiThemeProvider>
        {(this.props.user && this.props.user.documentStatus === "RETRY") ||
        (this.props.authUser && !this.props.authUser.emailVerified) ? (
          this.renderSnackbar()
        ) : (
          <Link to="/account/verify-document">{this.renderSnackbar()}</Link>
        )}
      </MuiThemeProvider>
    );
  }
}
