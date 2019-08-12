import React from 'react';
import firebase from '../../../firebase';
import "./index.css";
import InfluencerAdCard from "../common/influencer-ad-card/influencer-ad-card";

class AdBoard extends React.Component {
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
            closingTime: Date.now() / 1000 - 3000,
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
            overUnder: 'Over 10'
          },
          gameDescription: 'Major League Baseball, LAA @ STL, 6:30pm',
          gamePickSource: 'FS1’s Lock It In'
        }
      ]
    };
  }

  componentDidMount() {
    // firebase.database().ref('casinoPools').on('value', snapshot => {
    //   const val = snapshot.val() || [];
    //   const poolIds = Object.keys(val).filter(p => val[p]);
    //   this.setState({ poolIds });
    //
    //   // const { fundId } = this.props;
    //   // getFundFeed(fundId, async (fund) => {
    //   //   const { long, fade } = await getManagerLongFade(fund.managerId);
    //   //   getFundBets(fundId).then(async (bets) => {
    //   //     const longBet = bets.find(bet => !bet.fade);
    //   //     const { potentialGames } = await getFundDetails(fundId);
    //   //     const game = potentialGames[0];
    //   //     const gameDescription = `Game Info: Major League Baseball, ${game.awayTeamAlias}  @ ${game.homeTeamAlias}, ${moment(game.scheduledTimeUnix).format('hh:mm a')}`
    //   //     let selectedTeam;
    //   //     let gameTeams;
    //   //     if (longBet.selectionId) selectedTeam = await getTeam(fund.league, longBet.selectionId);
    //   //     else gameTeams = {
    //   //       home: await getTeam(fund.league, game.homeTeamId),
    //   //       away: await getTeam(fund.league, game.awayTeamId)
    //   //     }
    //   //     const streak = await getManagerWinStreak(fund.managerId)
    //   //     const obj = {
    //   //       fund,
    //   //       withPct: long / (long + fade) * 100 || 0,
    //   //       fadePct: fade / (long + fade) * 100 || 0,
    //   //       streak,
    //   //       selectedTeam,
    //   //       gameTeams,
    //   //       longBet,
    //   //       gameDescription
    //   //     }
    //   //     this.setState(obj);
    //   //   });
    //   // });
    //
    // });
  }

  render() {
    return (
      <div className="ad-board-wrapper full-screen-page d-flex">
        <div className="left-section d-flex justify-content-evenly align-items-center">
          {this.state.gamePicks.map((gamePick) => <InfluencerAdCard key={gamePick.id} gamePick={gamePick} />)}
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
