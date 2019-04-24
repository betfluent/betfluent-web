// @flow
/* eslint-disable */

import React, { Component } from "react";
import Paper from "material-ui/Paper";
import { Card } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "./Styles";
import { setSportsPreferences } from "../Services/DbService";

const themeColor = gMuiTheme.palette.themeColor;

type SportsPreferenceProps = {
  user: User,
  display: string,
  edit: boolean,
  finishEdit: () => void
};

export default class SportsPreference extends Component<SportsPreferenceProps> {
  constructor(props) {
    super(props);
    this.state = {
      display: props.display,
      selected: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const sportsPreference = Object.keys(
        nextProps.user.preferences.sports || {}
      );
      this.setState({ selected: sportsPreference });
    }
  }

  onCancelClick(edit) {
    if (edit) {
      this.props.finishEdit();
    }
    this.setState({ display: "none" });
  }

  onDoneClick(user, edit) {
    setSportsPreferences(user.id, this.state.selected);
    this.onCancelClick(edit);
  }

  selectSport(sport) {
    const selected = this.state.selected;
    if (selected.includes(sport)) {
      const index = selected.indexOf(sport);
      selected.splice(index, 1);
      this.setState({ selected });
    } else {
      selected.push(sport);
      this.setState({ selected });
    }
  }

  renderSportsChoice = sport => (
    <Card
      key={sport}
      id={sport}
      zDepth={2}
      className="sportsChoice"
      onClick={() => {
        this.selectSport(sport);
      }}
      style={{
        boxShadow: this.state.selected.includes(sport)
          ? `${themeColor} 0px 1px 4px 4px`
          : "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px"
      }}
    >
      <img
        src={``}
        alt={sport}
      />
      <p>{sport}</p>
    </Card>
  );

  render() {
    const user = this.props.user;
    const edit = this.props.edit;

    const sports = [
      "BASEBALL",
      "FOOTBALL",
      "BASKETBALL",
      "GOLF",
      "TENNIS",
      "HOCKEY",
      "SOCCER",
      "CRICKET",
      "RACING"
    ];

    const paperStyle = {
      position: "absolute",
      height: "100vh",
      width: "100vw",
      top: 0,
      left: 0,
      zIndex: 2000,
      overflowY: "scroll",
      display: this.state.display
    };

    const editPaperStyle = {
      width: "100%",
      display: "block",
      textAlign: "center"
    };

    const editChoicesStyle = {
      width: "90%",
      marginTop: 8
    };

    const choicesStyle = {
      marginTop: 24
    };

    return (
      <MuiThemeProvider muiTheme={gMuiTheme}>
        <Paper
          zDepth={0}
          style={edit ? editPaperStyle : paperStyle}
          className="sportsPreference"
        >
          {!edit ? (
            <div>
              <h1>Sports Preference</h1>
              <p>Please help us customize your experience</p>
              <p>Choose your favorite sports</p>
            </div>
          ) : null}

          <div
            className="sportsChoices flexContainer"
            style={edit ? editChoicesStyle : choicesStyle}
          >
            {sports.map(sport => this.renderSportsChoice(sport))}
          </div>
          <RaisedButton
            secondary
            label={edit ? "cancel" : "skip"}
            onClick={() => {
              this.onCancelClick(edit);
            }}
          />
          <RaisedButton
            primary
            label="Done"
            style={{ margin: "0 0 36px 24px" }}
            disabled={!this.state.selected.length}
            onClick={() => {
              this.onDoneClick(user, edit);
            }}
          />
        </Paper>
      </MuiThemeProvider>
    );
  }
}
