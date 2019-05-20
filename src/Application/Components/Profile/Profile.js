// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ManagerProfile from "./ManagerProfile";
import { appTheme } from "../Styles";
import { getManagerDetail } from "../../Services/DbService";

type ProfileProps = {
  match: {
    params: {
      managerId: string
    }
  },
  isManager: boolean,
  size: number
};

export default class Profile extends Component<ProfileProps> {
  componentWillMount() {
    getManagerDetail(this.props.match.params.managerId).then(
      manager => {
        this.setState({ manager });
      }
    );
  }

  render() {
    if (!this.state || !this.state.manager) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    return (
      <ManagerProfile
        isManager={this.props.isManager}
        manager={this.state.manager}
        size={this.props.size}
      />
    );
  }
}
