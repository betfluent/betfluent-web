import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import * as clock from '../../../../Assets/clock-casino/clock.png';
import twitterLogoBlue from '../../../../Assets/twitterLogoBlue.png';
import { getFundFeed, getFundDetails, getManagerWinStreak, getTeam, getManagerLongFade } from '../../../Services/DbService';
import { getFundBets } from '../../../Services/ManagerService';
import CountDown from '../../CountDown';
import './influencer-ad-card.css';

class InfluencerAdCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    }
  }

  componentDidMount() {
    // const { fundId } = this.props;
    // getFundFeed(fundId, async (fund) => {
    //   const { long, fade } = await getManagerLongFade(fund.managerId);
    //   getFundBets(fundId).then(async (bets) => {
    //     const longBet = bets.find(bet => !bet.fade);
    //     const { potentialGames } = await getFundDetails(fundId);
    //     const game = potentialGames[0];
    //     const gameDescription = `Game Info: Major League Baseball, ${game.awayTeamAlias}  @ ${game.homeTeamAlias}, ${moment(game.scheduledTimeUnix).format('hh:mm a')}`
    //     let selectedTeam;
    //     let gameTeams;
    //     if (longBet.selectionId) selectedTeam = await getTeam(fund.league, longBet.selectionId);
    //     else gameTeams = {
    //       home: await getTeam(fund.league, game.homeTeamId),
    //       away: await getTeam(fund.league, game.awayTeamId)
    //     };
    //     const streak = await getManagerWinStreak(fund.managerId)
    //     const obj = {
    //       fund,
    //       withPct: long / (long + fade) * 100 || 0,
    //       fadePct: fade / (long + fade) * 100 || 0,
    //       streak,
    //       selectedTeam,
    //       gameTeams,
    //       longBet,
    //       gameDescription
    //     };
    //     this.setState(obj);
    //   });
    // });
  }

  render() {
    if (!this.state) return null;
    const { fund: { closingTime, manager }, withPct, fadePct, streak, selectedTeam, gameTeams, longBet, gameDescription, gamePickSource } = this.state;

    const renderTeams = () => {
      if (gameTeams) {
        return (
          <div className='game-teams over-under d-flex align-items-center justify-content-between'>
            <img src={gameTeams.away.avatarUrl} alt='away team' className='team-avatar'/>
            <div className='game-team-title'>{longBet.overUnder}</div>
            <img src={gameTeams.home.avatarUrl} alt='home team' className='team-avatar'/>
          </div>
        );
      } else {
        return (
          <div className='game-teams d-flex align-items-center'>
            <img src={selectedTeam.avatarUrl} alt='selected team' className='team-avatar'/>
            <div className='selected-team-info'>
              <div className='game-team-title'>{selectedTeam.name}</div>
              <div className='game-team-subtitle'>
                {longBet.points ? '(' + longBet.points + ')' : 'MONEYLINE'}
              </div>
            </div>
          </div>
        );
      }
    };

    const renderTime = closingTime => {
      const diff = closingTime - Date.now() / 1000;
      if (diff < 0) return <span style={{ flexGrow: 2, textAlign: 'left', letterSpacing: 8, marginLeft: 0 }}>LIVE</span>;
      if (diff / 3600 > 1) {
        return <Moment fromNow ago date={closingTime * 1000} />;
      }
      return <CountDown diff={diff} hideSeconds />;
    };

    return (
      <div className="card-wrapper">
        <div className="card-avatar-wrapper">
          <img className="card-avatar" src={manager.avatarUrl} alt="Celebrity Photo" />
        </div>

        <div className='card-body'>
          <div className="card-title d-flex justify-content-between">
            <div>{manager.name}</div>
            <a className="twitter-link d-flex align-items-center" href={manager.twitterUrl} target="_blank">
              <img src={twitterLogoBlue} alt="twitter" />
              &nbsp;@{manager.name}
            </a>
          </div>

          <div className="card-subtitle d-flex align-items-center">
            <span className="card-subtitle-text d-flex">Last Ten: </span>
            <div className='streak-tags d-flex justify-content-between flex-grow-1'>
              {streak.map((result, i) => <div key={i} className={result === 'W' ? 'streak-tag win' : 'streak-tag loss'}>{result}</div>)}
            </div>
          </div>

          {renderTeams()}

          <div className="card-game-info"><strong>Game Info:</strong> {gameDescription}</div>

          <div className="card-status-wrapper">
            <div className="card-status-title">Current Status</div>
            <div className="d-flex justify-content-between">
              <div className='status-wrapper'>
                <div className="status-tag with">
                  {Math.ceil(withPct)+ '%'}
                </div>
                <div className='status-note'>With</div>
              </div>
              <div className='status-wrapper'>
                <div className="status-tag against">
                  {Math.floor(fadePct)+ '%'}
                </div>
                <div className='status-note'>Against</div>
              </div>
              <div className="time-left d-flex align-items-center">
                <img src={clock} alt="clock" className='clock' />
                {renderTime(closingTime)}
              </div>
            </div>
          </div>
        </div>

        <div className='card-footer'>
          <div className='game-pick-source'>
            *Game pick provided by {gamePickSource}.
          </div>
        </div>
      </div>
    )
  }
}

export default InfluencerAdCard;
