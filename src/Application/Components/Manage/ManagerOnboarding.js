// @flow
/* eslint-disable */

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import V0MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { mgAppTheme, mgMuiTheme } from "../ManagerStyles";
import User from "../../Models/User";
import Avatar from "../Avatar";
import { signOut } from "../../Services/AuthService";
import { updateManagerDetails } from "../../Services/DbService";

const textColor1 = mgMuiTheme.palette.textColor1;
const textColor2 = mgMuiTheme.palette.textColor2;

type OnboardingProps = {
  finishOnboarding: () => void,
  setLock: () => void,
  showOnboarding: boolean,
  user: User
};

export default class Onboarding extends Component<OnboardingProps> {
  constructor(props) {
    super(props);
    this.renderOnboardingGuide = this.renderOnboardingGuide.bind(this);
    this.state = {
      specialty: "",
      summary: ""
    };
  }

  componentDidMount() {
    if (this.props.showOnboarding) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ display: "block" });
    } else {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ display: "none" });
    }
  }

  onSpecialtyChange(event) {
    this.setState({ specialty: event.target.value });
  }

  onSummaryChange(event) {
    this.setState({ summary: event.target.value });
  }

  logout = () => {
    signOut().then(() => {
      this.props.setLock(true);
    });
  };

  completeOnboarding() {
    const updates = {
      summary: this.state.summary,
      specialty: this.state.specialty
    };

    updateManagerDetails(this.props.user.manager.id, updates);

    setTimeout(() => {
      this.setState({ display: "none" });
      this.props.finishOnboarding();
    }, 300);
    return null;
  }

  renderOnboardingGuide() {
    if (!this.props.user.manager.avatarUrl) {
      return "Upload a Profile Picture. This will be the first thing users see of you, so make sure it’s recognizable!";
    }
    if (!this.state.specialty) {
      return "Choose a specialty - a league that you have expertise in.";
    }
    return "Write a short summary about yourself so that users can learn about you. You can change it later. When you’re all done, click save below.";
  }

  render() {
    if (!this.props.user) return null;

    const manager = this.props.user.manager;

    const logoStyle = {
      height: 40,
      margin: "auto",
      marginBottom: "24px"
    };

    const headerTitleStyle = {
      fontSize: 20,
      lineHeight: "28px",
      color: textColor1,
      fontWeight: 500
    };

    return (
      <V0MuiThemeProvider muiTheme={mgMuiTheme}>
        <div
          className="managerOnboarding"
          style={{ display: this.state.display }}
        >
          <div
            className="contentHeader onboardingContent"
            style={{ color: textColor1 }}
          >
            <div style={logoStyle}>
              <img
                src="/bf-logo.png"
                alt="Betfluent"
                style={{ height: "40px" }}
              />
            </div>
            <h1>Manager Onboarding</h1>
            <h2>
              Weclome to Betfluent! You’re joining the ranks of the best
              bettors, wagerers, and statisticians from sea to shining sea - no
              small feat.{" "}
            </h2>
            <h2>
              To get you started we’ll collect some basic information to create
              your manager profile with.
            </h2>

            <div className="onboardingInputs">
              <div
                className="flexContainer"
                style={{ justifyContent: "flex-start" }}
              >
                <div>
                  <Avatar
                    width={80}
                    userName={manager.name}
                    userAvatar={manager.avatarUrl}
                    key={manager.avatarUrl}
                    isManager
                    allowUpload
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={headerTitleStyle}>{manager.name || null}</div>
                  <div style={{ color: textColor2, fontSize: 12 }}>
                    {manager.company || null}
                  </div>

                  <div
                    className="specialtyInput"
                    style={{ display: manager.avatarUrl ? "block" : "none" }}
                  >
                    <MuiThemeProvider theme={mgAppTheme}>
                      <FormControl>
                        <Select
                          value={this.state.specialty}
                          onChange={event => {
                            this.onSpecialtyChange(event);
                          }}
                          name="specialty"
                          style={{ width: 100 }}
                          MenuProps={{
                            style: { zIndex: 1400 }
                          }}
                          onFocus={() => {
                            this.setState({
                              specialtyError: false,
                              specialtyHelper: null
                            });
                          }}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Specialty
                          </MenuItem>
                          <MenuItem value="MLB">MLB</MenuItem>
                          <MenuItem value="NBA">NBA</MenuItem>
                          <MenuItem value="NCAAMB">NCAAMB</MenuItem>
                          <MenuItem value="FIFA">FIFA</MenuItem>
                        </Select>
                      </FormControl>
                    </MuiThemeProvider>
                  </div>
                </div>
              </div>

              <div
                className="summaryInput"
                style={{
                  display: this.state.specialty !== "" ? "block" : "none"
                }}
              >
                <MuiThemeProvider theme={mgAppTheme}>
                  <div>
                    <TextField
                      label="Summary"
                      fullWidth
                      multiline
                      rowsMax="4"
                      value={this.state.summary}
                      onChange={event => {
                        this.onSummaryChange(event);
                      }}
                      onFocus={() => {
                        this.setState({
                          summaryError: false,
                          summaryHelper: null
                        });
                      }}
                    />
                  </div>
                </MuiThemeProvider>
              </div>

              <div className="onboardingGuide">
                {this.renderOnboardingGuide()}
              </div>

              <div
                style={{
                  marginTop: 32,
                  textAlign: "center"
                }}
              >
                <RaisedButton
                  label="Save"
                  primary
                  onClick={() => {
                    this.completeOnboarding();
                  }}
                  disabled={
                    !manager.avatarUrl ||
                    !this.state.specialty ||
                    !this.state.summary
                  }
                />
              </div>
              <div
                style={{
                  marginTop: 4,
                  textAlign: "center"
                }}
              >
                <FlatButton
                  label="Sign Out"
                  primary
                  onClick={() => {
                    this.logout();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
