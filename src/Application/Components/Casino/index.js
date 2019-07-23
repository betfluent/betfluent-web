import React from 'react';
import firebase from '../../../firebase';
import Card from './card';
import "./index.css";

class CasinoPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    firebase.database().ref('casinoPools').on('value', snapshot => {
      const val = snapshot.val();
      const poolIds = Object.keys(val).filter(p => val[p]);
      this.setState({ poolIds });
    });
  }
  
  render() {
    const { poolIds = [] } = this.state;
    return (
      <div className="betfluence-wrapper">
        <div className="betfluence-title">
          BETFLUENCE
        </div>
        <div className="betfluence-subtitle">
          pick with or against top influencers
        </div>
        <div className="todays-picks">
          Today's Picks
        </div>
        <div className="picks-wrapper">
          {poolIds.map((poolId, i) => <Card key={poolId} fundId={poolId} />)}
        </div>
        <div className="betfluence-bottom">
          HEAD TO THE LOCAL SPORTSBOOK AND SAY
          WHO YOU ARE BETTING WITH OR AGAINST
        </div>
      </div>
    )
  }
}

export default CasinoPage;