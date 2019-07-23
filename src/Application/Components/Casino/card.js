import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import * as clock from '../../../Assets/clock-casino/clock.png';
import { getFundFeed, getFundDetails, getManagerWinStreak, getTeam, getManagerLongFade } from '../../Services/DbService';
import { getFundBets } from '../../Services/ManagerService';
import CountDown from '../CountDown';
import './card.css';

const renderTime = closingTime => {
  const diff = closingTime - Date.now() / 1000;
  if (diff < 0) return <span style={{ flexGrow: 2, textAlign: 'left', letterSpacing: 8, marginLeft: 0 }}>LIVE</span>;
  if (diff / 3600 > 1) {
      return <Moment fromNow ago date={closingTime * 1000} />;
  }
  return <CountDown diff={diff} hideSeconds />;
}

export default class extends React.Component {
  componentDidMount() {
    const { fundId } = this.props;
    getFundFeed(fundId, async (fund) => {
      const { long, fade } = await getManagerLongFade(fund.managerId);
      getFundBets(fundId).then(async (bets) => {
        const longBet = bets.find(bet => !bet.fade);
        const { potentialGames } = await getFundDetails(fundId);
        const game = potentialGames[0];
        const gameDescription = `Game Info: Major League Baseball, ${game.awayTeamAlias}  @ ${game.homeTeamAlias}, ${moment(game.scheduledTimeUnix).format('hh:mm a')}`
        let selectedTeam;
        let gameTeams;
        if (longBet.selectionId) selectedTeam = await getTeam(fund.league, longBet.selectionId);
        else gameTeams = {
          home: await getTeam(fund.league, game.homeTeamId),
          away: await getTeam(fund.league, game.awayTeamId)
        }
        const streak = await getManagerWinStreak(fund.managerId)
        const obj = {
          fund,
          withPct: long / (long + fade) * 100 || 0,
          fadePct: fade / (long + fade) * 100 || 0,
          streak,
          selectedTeam,
          gameTeams,
          longBet,
          gameDescription
        }
        this.setState(obj);
      });
    });
  }

  render() {
    if (!this.state) return null;

    const { fund: { closingTime, manager }, withPct, fadePct, streak, selectedTeam, gameTeams, longBet, gameDescription } = this.state;
    return (
      <div className="card-wrapper">
        <div className="card-avatar-wrapper">
          <img className="card-avatar" src={manager.avatarUrl} alt="Celebrity Photo" />
        </div>
        <div className="card-title">{manager.name}</div>
        <div className="card-subtitle">
          <span className="card-subtitle-text">Last Ten: </span>{streak.map((result, i) => <div key={i} className={result === 'W' ? 'subtitle-win' : 'subtitle-loss'}>{result}</div>)}
        </div>
        <div className={`selection-wrapper ${gameTeams ? 'selection-wrapper-over-under' : ''}`}>
          <img style={gameTeams ? { marginRight: 0 } : {}} className="selection-avatar" src={`${selectedTeam ? selectedTeam.avatarUrl : gameTeams.away.avatarUrl}`} alt="Selected Team" />
          <div>
            <div className="selected-title">
              {selectedTeam ? selectedTeam.name : longBet.overUnder}
            </div>
            <div className="selected-subtitle">
              {`${longBet.points ? '(' + longBet.points + ')' : 'MONEYLINE'}`}
            </div>
          </div>
          {gameTeams && <img style={{ marginRight: 0 }} className="selection-avatar" src={gameTeams.home.avatarUrl} alt="Selected Team" />}
        </div>
        <div className="card-game-info">{gameDescription}</div>
        <div className="card-status-wrapper">
          <div className="card-status-title">Current Status</div>
          <div className="card-stat-wrapper">
            <div><div className="card-stat-with">{Math.ceil(withPct)+ '%'}</div><div>With</div></div>
            <div><div className="card-stat-fade">{Math.floor(fadePct)+ '%'}</div><div>Against</div></div>
            <div className="card-stat-time-left"><img src={clock} alt="clock" />{renderTime(closingTime)}</div>
          </div>
        </div>
      </div>
    )
  }
}