import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { mgMuiTheme } from "./ManagerStyles";
import MobileTopHeaderContainer from "../Containers/MobileTopHeaderContainer";
import * as explain from "../../Assets/explain-image/explain-image.png";
import * as click from "../../Assets/click-money/click-money.png";
import * as like from "../../Assets/like/like.png";
import * as ad from "../../Assets/ad.png";
import * as learnHow from "../../Assets/learn-how-button.png";
import * as viewLobby from "../../Assets/view-lobby-button.png";
import * as influencerProgram from "../../Assets/influencer-program.png";
import * as faq from "../../Assets/faq.png";
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
      paddingTop: 10,
      height: "100%",
      width: "95%",
      backgroundColor: "transparent",
      zIndex: 0,
      marginLeft: 10
    };

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
          <MobileTopHeaderContainer className='mobile-header' />
          <img src={ad} alt="promocode" className="ad-image" />

          <div className="learn-container">
            <img src={learnHow} alt="promocode" className="learn-button" />
          </div>

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
                <div className="copy-wrapper-2">
                  <div className="home-copy-2">You choose to bet with or against</div>
                  <img src={viewLobby} alt="explain" className="view-lobby-button" />
                </div>
                <img src={click} alt="click" className="home-image" />
              </div>
              <div className="home-even">
                <img src={like} alt="like" className="home-image" />
                <div className="copy-wrapper">
                  <div className="home-copy">Build reputation, gain followers, learn, and earn!</div>
                </div>
              </div>
              <div className="bottom-container">
                <div className="copy-wrapper">
                  <img src={influencerProgram} alt="influencer-prograk" className="bottom-button" />
                  <img src={faq} alt="faq" className="bottom-button" />
                </div>
              </div>
            </div>
          </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(ManagerLandingPage);
