import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { mgMuiTheme } from "./ManagerStyles";

const mobileBreakPoint = mgMuiTheme.palette.mobileBreakPoint;

export class ManagerLandingPageHeader extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <div className="mlpHeader flexContainer">
          <Link to="/influencer-info">
            <img
              src="/betfluent-logo.png"
              alt="betFluent"
              style={{ height: "40px" }}
            />
          </Link>
          {this.props.size > mobileBreakPoint ? (
            <div className="mlpHeaderBtns flexContainer">
              <Link to="/">
                <FlatButton label="Home" />
              </Link>
              <Link
                to={{
                  pathname: "/faq",
                  state: { fromManagerLandingpage: true }
                }}
              >
                <FlatButton label="FAQ" />
              </Link>
              <Link to="/register">
                <RaisedButton
                  label="Get Started"
                  primary
                  style={{ marginLeft: 16, borderRadius: 6 }}
                  buttonStyle={{ borderRadius: 6 }}
                  overlayStyle={{ borderRadius: 6 }}
                />
              </Link>
            </div>
          ) : null}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(ManagerLandingPageHeader);
