// @flow
/* eslint-disable */

import React, { Component } from "react";
import Lottie from "react-lottie";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { VerifyEmailService } from "../../Services/BackendService";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import { appTheme, gMuiTheme } from "../Styles";
import * as verifySuccess from "./verify_success.json";
import * as verifyError from "./verify_error.json";

const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type VerifyEmailProps = {
  authUser: {
    email: string,
    emailVerified: boolean,
    reload: () => void
  },
  history: {
    replace: () => void
  },
  size: number
};

export default class VerifyEmail extends Component<VerifyEmailProps> {
  state = { message: null };

  componentDidMount() {
    this.verifyEmail(this.props.authUser);
  }

  verifyEmail() {
    const emailCode = window.location.hash.replace("#", "");
    VerifyEmailService(emailCode)
      .then(response => {
        if (response.status === "success") {
          authUser.reload();
          this.setState({
            emailVerified: true,
            message: response.message
          });
          setTimeout(() => {
            this.props.history.replace("/");
          }, 3000);
        } else {
          this.setState({
            emailVerified: false,
            message: response.message
          });
        }
      })
      .catch(err => {
        this.setState({
          emailVerified: false,
          message: err.message
        });
      });
  }

  renderLottie = () => {
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

    if (this.state.emailVerified) {
      return <Lottie options={verifySuccessOptions} width={120} />;
    }

    if (this.state.emailVerified === false) {
      return <Lottie options={verifyErrorOptions} width={120} />;
    }

    return <div style={{ height: 124 }} />;
  };

  render() {
    if (!this.props.authUser)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
          <div className="emailVerification">
            <h1>Email Verification</h1>
            <p>{this.state.message || "Verifiying your email address..."}</p>
            <div style={{ marginTop: 24 }}>{this.renderLottie()}</div>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
