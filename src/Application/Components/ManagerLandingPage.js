import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Divider from "material-ui/Divider";
import { mgMuiTheme } from "./ManagerStyles";
import homePageBgImg from "../../Assets/managerLandingpageBgImg.png";
import videoCover from "../../Assets/legal_dfs.jpeg";
import idVerification from "../../Assets/manager_id_verification.png";
import connect from "../../Assets/connect.png";
import placeBet from "../../Assets/manager_place_bet.png";
import ManagerLandingPageHeader from "./ManagerLandingPageHeader";

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
                  style={{ justifyContent: "space-evenly", marginTop: 36 }}
                >
                  <div className="mlpFit">
                    <h2 style={{ color: themeColor }}>Do You?</h2>
                    <Divider />
                    <ul>
                      <li>
                        <p>Enjoy betting on sports</p>
                      </li>
                      <li>
                        <p>Think you have an edge</p>
                      </li>
                      <li>
                        <p>Have strong social presence</p>
                      </li>
                    </ul>
                  </div>
                  <div className="mlpFit">
                    <h2 style={{ color: themeColor }}>
                      In a Legal DFS state?
                    </h2>
                    <Divider />
                    <div className="learnMoreVideo">
                      <img src={videoCover} alt="Learn more" />
                    </div>
                  </div>
                  <div className="mlpFit">
                    <h2 style={{ color: themeColor }}>Are You?</h2>
                    <Divider />
                    <ul>
                      <li>
                        <p>An experienced sports bettor</p>
                      </li>
                      <li>
                        <p>Capable of explaining your picks</p>
                      </li>
                      <li>
                        <p>Committed to educating novices</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mlpGuides">
              <div className="mlpContent">
                <h1 style={{ color: themeColor }}>How to Become an influencer</h1>
                <p>
                  Becoming a influencer with betFluent is a risk free way
                  to make money, especially if you love sports betting. However
                  we take the regulations around this industry very seriously
                  for the benefit of both you and our users.
                </p>

                <div
                  className="flexContainer"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <div className="mlpGuide">
                    <h2 style={{ color: themeColor }}>Register</h2>
                    <img src={idVerification} alt="Register" />
                    <p>
                      Provide us some basic information such as your Name, DOB
                      and Address.
                    </p>
                  </div>
                  <div className="mlpGuide">
                    <h2 style={{ color: themeColor }}>Connect</h2>
                    <img src={connect} alt="Connect" />
                    <p>
                      Find users, invite friends, and create a following to
                      educate users about your picks.
                    </p>
                  </div>
                  <div className="mlpGuide">
                    <h2 style={{ color: themeColor }}>Bet</h2>
                    <img src={placeBet} alt="Bet" />
                    <p>
                      Create a contest and promote your
                      pool on Instagram Facebook and Twitter.
                    </p>
                  </div>
                </div>

                <Link to="/register">
                  <RaisedButton
                    style={{ width: 220, borderRadius: 6 }}
                    buttonStyle={{ borderRadius: 6 }}
                    overlayStyle={{ borderRadius: 6 }}
                    primary
                    label="BECOME AN INFLUENCER"
                  />
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
