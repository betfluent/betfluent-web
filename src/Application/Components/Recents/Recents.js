// @flow
/* eslint-disable */
/* eslint-disable */
import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import RecentTransactions from "./RecentTransactions";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import { appTheme, gMuiTheme } from "../Styles";

const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type ProfileProps = {
  user: User,
  isManager: boolean,
  size: number
};

const Profile = (props: ProfileProps) => {
  if (!props.user)
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
        {props.size < mobileBreakPoint ? <MobileTopHeaderContainer /> : null}
        <RecentTransactions size={props.size} show user={props.user} />
      </div>
    </V0MuiThemeProvider>
  );
};

export default Profile;
