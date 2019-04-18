// @flow

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "./Styles";
import LandingPageHeader from "./LandingPageHeader";
import Footer from "./Footer";

type SourcesProps = {
  size: number
};

const textColor3 = gMuiTheme.palette.textColor3;

export default class Sources extends Component<SourcesProps> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <div className="sources">
          <LandingPageHeader size={this.props.size} />

          <div className="sourcesContent">
            <h1>Sources</h1>
            <h2 style={{ color: textColor3 }}>Lottie File</h2>
            <div className="sourcesContainer">
              <div className="sourcesItem">@davecounts/Permission</div>
              <div className="sourcesItem">@edwinnollen/Location</div>
              <div className="sourcesItem">@kibinchi/Search a Location</div>
              <div className="sourcesItem">@shafiuhussain/Loading...</div>
              <div className="sourcesItem">@/Material wave loading</div>
              <div className="sourcesItem">
                @arthurbauer/Animation for monobank
              </div>
              <div className="sourcesItem">
                @tomasbarcys/android-fingerprint
              </div>
              <div className="sourcesItem">@dariusafchar/Success</div>
            </div>
          </div>

          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}
