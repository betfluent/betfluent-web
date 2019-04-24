// @flow
/* eslint-disable */

import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import LandingPageHeader from "./LandingPageHeader";
import SportsBetsExplained from "./SportsBetsExplained";
import Footer from "./Footer";
import { gMuiTheme } from "./Styles";

type SportsBetsProps = {
  size: number
};

const SportsBetsExplainedPage = (props: SportsBetsProps) => {
  const paperStyle = {
    position: "absolute",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    backgroundColor: "#fff"
  };

  return (
    <MuiThemeProvider muiTheme={gMuiTheme}>
      <div style={paperStyle}>
        <LandingPageHeader size={props.size} />
        <div className="lpbody" style={{ marginTop: 48 }}>
          <SportsBetsExplained size={props.size} />
        </div>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
};

export default SportsBetsExplainedPage;
