// @flow

import React, { Component } from "react";
import ReactGA from "react-ga";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import VisibilityOn from "material-ui/svg-icons/action/visibility";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "../Styles";
import { signOut, reauthenticateWithEmail } from "../../Services/AuthService";

type ReauthenticateModalProps = {
  size: number,
  open: boolean,
  authUser: {
    email: string
  },
  authenticateUser: () => void
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

export default class ReauthenticateModal extends Component<
  ReauthenticateModalProps
> {
  state = {
    passwordVisibility: false,
    passwordError: null
  };

  onPasswordChange = (e, password) => {
    this.setState({ password, passwordError: null });
  };

  setLock(lock) {
    this.setState({ lock });
  }

  reauthenticate = () => {
    if (this.state.password === undefined) {
      this.setState({ passwordError: "Please enter your password" });
      return null;
    }

    reauthenticateWithEmail(this.props.authUser.email, this.state.password)
      .then(() => {
        ReactGA.modalview("reauthenticateModal");
        this.props.authenticateUser(true);
      })
      .catch(error => {
        const passwordError = error.message;
        this.setState({ passwordError });
      });

    return null;
  };

  signOut = () => {
    ReactGA.modalview("reauthenticateModal");
    signOut().then(() => {
      this.setLock(true);
    });
  };

  pwFocused = () => {
    const icon = this.pwVisibility;
    icon.style.visibility = "visible";
  };

  showPassword = () => {
    let passwordVisibility = this.state.passwordVisibility;
    passwordVisibility = !passwordVisibility;
    this.setState({ passwordVisibility });
  };

  checkEnter = event => {
    if (event.keyCode === 13) this.reauthenticate();
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Dialog
          title="Re-enter your password"
          titleStyle={{ textAlign: "center" }}
          modal
          open={this.props.open}
          bodyStyle={{ height: 150, overflowX: "hidden" }}
          contentStyle={{ width: this.props.size > 340 ? 350 : 310 }}
          paperProps={{ style: { height: 300 } }}
          style={{ overflowY: "scroll" }}
        >
          <div style={{ textAlign: "center" }}>
            <div>For your security, please re-authenticate.</div>
            <TextField
              type={this.state.passwordVisibility ? "text" : "password"}
              className="formInputStyle"
              floatingLabelText="Password"
              onFocus={this.pwFocused}
              onChange={this.onPasswordChange}
              onKeyDown={this.checkEnter}
              errorText={this.state.passwordError}
            />
            <span
              role="presentation"
              className="pwVisibility"
              ref={pwVisibility => {
                this.pwVisibility = pwVisibility;
              }}
              style={{ visibility: "hidden" }}
              onClick={this.showPassword}
            >
              {this.state.passwordVisibility ? (
                <VisibilityOn />
              ) : (
                <VisibilityOff />
              )}
            </span>
            <div style={buttonContainerStyle}>
              <RaisedButton
                primary
                style={buttonStyle}
                fullWidth
                label="Submit"
                onClick={this.reauthenticate}
              />
              <FlatButton
                primary
                style={buttonStyle}
                fullWidth
                label="Sign out"
                onClick={this.signOut}
              />
            </div>
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
