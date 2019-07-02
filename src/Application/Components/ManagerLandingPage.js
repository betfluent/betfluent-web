import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { mgMuiTheme } from "./ManagerStyles";
import idVerification from "../../Assets/manager_id_verification.png";
import connect from "../../Assets/connect.png";
import placeBet from "../../Assets/manager_place_bet.png";
import ManagerLandingPageHeader from "./ManagerLandingPageHeader";
import * as MacBook from "../../Assets/macbook-image.png";
import * as legalDFS from "../../Assets/legal_dfs.jpeg";

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
      height: "100%",
      width: "100%",
      backgroundColor: "#f8f6fc"
    };

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <div style={paperStyle}>
          <ManagerLandingPageHeader size={this.props.size} />
          <div className="mlpbody">
            <div className="mlpFits">
              <div className="mlpContent">
                  <div className="landing-title">A Perfect Fit If You...</div>  
                  <ul className="landing-sub-list">
                  <li className="landing-sub-item">Want to help thousands learn about making wagers</li>
                  <li className="landing-sub-item">Love sports and are an experienced bettor</li>
                  <li className="landing-sub-item">Hold strong social presence</li>
                  <li className="landing-sub-item">Are 18+ years old</li>
                </ul>
                <div
                  className="flexContainer"
                  style={{ justifyContent: "space-between", marginTop: 36 }}
                >
                  <div className="mac-image-wrapper">
                    <img className="mac-image" src={MacBook} alt="app-on-screen" />
                  </div>
                  <div>
                    <ul className="landing-sub-list">
                      <li className="landing-sub-item-alt">Create Contests</li>
                      <li className="landing-sub-item-alt">Explain Your Picks</li>
                      <li className="landing-sub-item-alt">Earn 5% Commision</li>
                      <li className="landing-sub-item-link"><Link to="/register">Register Now</Link></li>
                    </ul>
                  </div>
                </div>
              </div>  
            </div>

            <div className="legal-dfs-state">
              <div>
                <div className="legal-dfs-state-title">In A Legal DFS State?</div>
                <div className="legal-dfs-state-content">
                  Betfluent takes industry 
                  regulations seriously for the 
                  benefit of both you and other
                  users. Check if you are in a 
                  DFS compliant state before
                  registering. 
                </div>
              </div>
              <div className="legal-dfs-map">
                <img src={legalDFS} alt="Legal DFS States" style={{ width: '100%', height: '100%'}} />
              </div>
            </div>
            <div className="mlpGuides">
              <div className="mlpContent">
                <div className="how-to-title">How To Become An Influencer</div>
                <div
                  className="flexContainer"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <div className="mlpGuide">
                    <img src={idVerification} alt="Register" />
                    <div className="guide-sub-title">Register</div>
                    <div className="guide-sub-content">
                      Provide us some basic information such as your Name, DOB
                      and Address.
                    </div>
                  </div>
                  <div className="mlpGuide">
                    <img src={connect} alt="Connect" />
                    <div className="guide-sub-title">Connect</div>
                    <div className="guide-sub-content">
                      Find users, invite friends, and create a following to
                      educate users about your picks.
                    </div>
                  </div>
                  <div className="mlpGuide">
                    <img src={placeBet} alt="Bet" />
                    <div className="guide-sub-title">Bet</div>
                    <div className="guide-sub-content">
                      Create a contest and promote it on Instagram, Facebook and Twitter.
                    </div>
                  </div>
                </div>

                <Link to="/register">
                  <div className="join-influencer-program">JOIN INFLUENCER PROGRAM</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(ManagerLandingPage);
