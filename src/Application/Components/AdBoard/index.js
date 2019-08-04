import React from 'react';
import firebase from '../../../firebase';
import "./index.css";

class AdBoard extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    // firebase.database().ref('casinoPools').on('value', snapshot => {
    //   const val = snapshot.val() || [];
    //   const poolIds = Object.keys(val).filter(p => val[p]);
    //   this.setState({ poolIds });
    // });
  }
  
  render() {
    return (
      <div className="ad-board-wrapper">
        <div className="left-section">

        </div>
        <div className="right-section">
          <div className="title">
            <p className="first-line">SPORTS BETTING </p>
            <p className="second-line">MADE EASY</p>
          </div>
          <div className="sub-title">
            Check out our new Sports Book and get in the action betting WITH or AGAINST these national influencers
          </div>
          <div className="disclaimer">
            DISCLAIMER: Influencers listed are not affiliated with William Hill or
            Oceans casino. This display has aggregated sports news and betting
            commentary, but does not endorse any particular influencer and is not
            an advocate for their sports betting ability. If you or someone you
            know has a gambling problem and wants help, call 1-800-GAMBLER.
          </div>
        </div>
      </div>
    )
  }
}

export default AdBoard;
