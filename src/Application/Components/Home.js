import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { mgMuiTheme } from "./ManagerStyles";
import MobileTopHeaderContainer from "../Containers/MobileTopHeaderContainer";
import * as explain from "../../Assets/explain-image/explain-image.png";
import * as click from "../../Assets/click-money/click-money.png";
import * as like from "../../Assets/like/like.png";
import "../../Styles/Home.css";

// type ManagerLandingPageProps = {
//   size: number
// };

// type ManagerLandingPageState = {
//   betType: string,
//   betDetail: string,
//   wagerAmount: number,
//   couldWin: number,
//   couldProfit: number,
//   toWin: string,
//   modalIndex: number,
//   modalHeader: string,
//   modalText: string
// };

const themeColor = mgMuiTheme.palette.themeColor;

export class ManagerLandingPage extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const paperStyle = {
      position: "relative",
      paddingTop: 56,
      height: "100%",
      width: "100%",
      backgroundColor: "#f8f6fc"
    };

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <React.Fragment>
          <MobileTopHeaderContainer />
          <div style={paperStyle}>
            <div className="home-container">
              <div className="home-even">
                <img src={explain} alt="explain" className="home-image" />
                <div className="copy-wrapper">
                  <div className="home-copy">Influencers pick games and explain their choices</div>
                  <Link to="/influencer-info"><div className="home-copy-cta">Learn how to become an influencer ></div></Link>
                </div>
              </div>
              <div className="home-odd">
                <div className="copy-wrapper">
                  <div className="home-copy">You choose to bet with or against</div>
                </div>
                <img src={click} alt="click" className="home-image" />
              </div>
              <div className="home-even">
                <img src={like} alt="like" className="home-image" />
                <div className="copy-wrapper">
                  <div className="home-copy">Build reputation, gain followers, learn, and earn!</div>
                </div>
              </div>
              <div className="home-odd">
                <div className="copy-wrapper">
                  <div className="copy"></div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(ManagerLandingPage);
