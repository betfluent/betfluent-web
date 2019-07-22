import React from 'react';
import Card from './card';
import "./index.css";

const poolIds = ['-LkLhY1mR77dZkwzBb7v', '-LkLhY1mR77dZkwzBb7v', '-LkLhY1mR77dZkwzBb7v', '-LkLhY1mR77dZkwzBb7v'];

const CasinoPage = () => {
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
        {poolIds.map((poolId, i) => <Card key={i} fundId={poolId} />)}
      </div>
      <div className="betfluence-bottom">
        HEAD TO THE LOCAL SPORTSBOOK AND SAY
        WHO YOU ARE BETTING WITH OR AGAINST
      </div>
    </div>
  )
}

export default CasinoPage;