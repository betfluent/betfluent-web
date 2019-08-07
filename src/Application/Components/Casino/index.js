import React from 'react';
import firebase from '../../../firebase';
import "./index.css";
import InfluencerAdCard from "../common/influencer-ad-card/influencer-ad-card";

class CasinoPage extends React.Component {
  constructor() {
    super();
    this.state = {
        gamePicks: [
            {
                id: 'gamePick0',
                fund: {
                    closingTime: Date.now() / 1000 + 3000,
                    manager: {
                        avatarUrl: 'https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/PHOTO-Travis-HS-727x727-480x480.jpg',
                        name: 'Clay Travis',
                        twitterUrl: 'https://twitter.com/ClayTravis'
                    }
                },
                withPct: '55',
                fadePct: '45',
                streak: ['W', 'W', 'L', 'L', 'W', 'L', 'W', 'W', 'L', 'L'],
                selectedTeam: {
                    name: 'New York Yankees',
                    avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                },
                gameTeams: '',
                longBet: {
                    points: '+4'
                },
                gameDescription: 'Major League Baseball, LAA @ STL, 6:30pm',
                gamePickSource: 'FS1’s Lock It In'
            },
            {
                id: 'gamePick1',
                fund: {
                    closingTime: Date.now() / 1000 + 3000,
                    manager: {
                        avatarUrl: 'https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/PHOTO-Travis-HS-727x727-480x480.jpg',
                        name: 'Clay Travis',
                        twitterUrl: 'https://twitter.com/ClayTravis'
                    }
                },
                withPct: '55',
                fadePct: '45',
                streak: ['W', 'W', 'L', 'L', 'W', 'L', 'W', 'W', 'L', 'L'],
                selectedTeam: {},
                gameTeams: {
                    away: {
                        name: 'New York Yankees',
                        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                    },
                    home: {
                        name: 'New York Yankees',
                        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                    }
                },
                longBet: {
                    overUnder: '48.5 Over (-110)'
                },
                gameDescription: 'Major League Baseball, LAA @ STL, 6:30pm',
                gamePickSource: 'FS1’s Lock It In'
            },
            {
                id: 'gamePick2',
                fund: {
                    closingTime: Date.now() / 1000 + 3000,
                    manager: {
                        avatarUrl: 'https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/PHOTO-Travis-HS-727x727-480x480.jpg',
                        name: 'Clay Travis',
                        twitterUrl: 'https://twitter.com/ClayTravis'
                    }
                },
                withPct: '55',
                fadePct: '45',
                streak: ['W', 'W', 'L', 'L', 'W', 'L', 'W', 'W', 'L', 'L'],
                selectedTeam: {
                    name: 'New York Yankees',
                    avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                },
                gameTeams: '',
                longBet: {
                    points: '+4'
                },
                gameDescription: 'Major League Baseball, LAA @ STL, 6:30pm',
                gamePickSource: 'FS1’s Lock It In'
            },
            {
                id: 'gamePick3',
                fund: {
                    closingTime: Date.now() / 1000 + 3000,
                    manager: {
                        avatarUrl: 'https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/PHOTO-Travis-HS-727x727-480x480.jpg',
                        name: 'Clay Travis',
                        twitterUrl: 'https://twitter.com/ClayTravis'
                    }
                },
                withPct: '55',
                fadePct: '45',
                streak: ['W', 'W', 'L', 'L', 'W', 'L', 'W', 'W', 'L', 'L'],
                selectedTeam: {},
                gameTeams: {
                    away: {
                        name: 'New York Yankees',
                        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                    },
                    home: {
                        name: 'New York Yankees',
                        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png'
                    }
                },
                longBet: {
                    overUnder: '48.5 Over (-110)'
                },
                gameDescription: 'Major League Baseball, LAA @ STL, 6:30pm',
                gamePickSource: 'FS1’s Lock It In'
            }
        ]
    };
  }

  componentDidMount() {
    firebase.database().ref('casinoPools').on('value', snapshot => {
      const val = snapshot.val() || [];
      const poolIds = Object.keys(val).filter(p => val[p]);
      this.setState({ poolIds });
    });
  }

  render() {
    return (
      <div className="casino-board-wrapper full-screen-page">
        <div className="casino-board-title">
            SPORTS BETTING MADE EASY
        </div>
        <div className="casino-board-subtitle">
            Check out our new Sports Book and get in the action
            betting WITH or AGAINST these national influencers
        </div>
        <div className="game-picks d-flex justify-content-evenly align-items-center">
            {this.state.gamePicks.map((gamePick) => <InfluencerAdCard key={gamePick.id} gamePick={gamePick} />)}
        </div>
        <div className="disclaimer">
            DISCLAIMER: Influencers listed are not affiliated with William Hill or
            Oceans casino. This display has aggregated sports news and betting
            commentary, but does not endorse any particular influencer and is not
            an advocate for their sports betting ability. If you or someone you
            know has a gambling problem and wants help, call 1-800-GAMBLER.
        </div>
      </div>
    )
  }
}

export default CasinoPage;
