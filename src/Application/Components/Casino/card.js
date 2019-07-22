import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import * as clock from '../../../Assets/clock-casino/clock.png';
import { getFundFeed, getFundDetails, getManagerWinStreak, getTeam } from '../../Services/DbService';
import { getFundBets } from '../../Services/ManagerService';
import CountDown from '../CountDown';
import './card.css';

const renderTime = closingTime => {
  const diff = closingTime - Date.now() / 1000;
  if (diff / 3600 > 1) {
      return <Moment fromNow ago date={closingTime * 1000} />;
  }
  return <CountDown diff={diff} />;
}

export default class extends React.Component {
  componentDidMount() {
    const { fundId } = this.props;
    getFundFeed(fundId, (fund) => {
      const withPct = fund.playerCount / (fund.playerCount + fund.fadePlayerCount) || 0;
      const fadePct = fund.fadePlayerCount / (fund.playerCount + fund.fadePlayerCount) || 0;
      getFundBets(fundId).then(async (bets) => {
        const longBet = bets.find(bet => !bet.fade);
        const selectedTeam = await getTeam(fund.league, longBet.selectionId);
        const { potentialGames } = await getFundDetails(fundId);
        const game = potentialGames[0];
        const gameDescription = `Game Info: Major League Baseball, ${game.awayTeamAlias}  @ ${game.homeTeamAlias}, ${moment(game.scheduledTimeUnix).format('hh:mm a')}`
        getManagerWinStreak(fund.managerId).then(streak => {
          const obj = {
            fund,
            withPct,
            fadePct,
            streak,
            selectedTeam,
            longBet,
            gameDescription
          }
          this.setState(obj);
        });
      });
    });
  }

  render() {
    if (!this.state) return null;

    const { fund: { closingTime, manager }, withPct, fadePct, streak, selectedTeam, longBet, gameDescription } = this.state;
    return (
      <div className="card-wrapper">
        <div className="card-avatar-wrapper">
          <img className="card-avatar" src={manager.avatarUrl} alt="Celebrity Photo" />
        </div>
        <div className="card-title">{manager.name}</div>
        <div className="card-subtitle">
          <span className="card-subtitle-text">Last Ten: </span>{streak.map((result, i) => <div key={i} className={result === 'W' ? 'subtitle-win' : 'subtitle-loss'}>{result}</div>)}
        </div>
        <div className="selection-wrapper">
          <img className="selection-avatar" src={selectedTeam.avatarUrl} alt="Selected Team" />
          <div>
            <div className="selected-title">
              {selectedTeam.name}
            </div>
            <div className="selected-subtitle">
              {`${longBet.points ? '(' + longBet.points + ')' : 'MONEYLINE'}`}
            </div>
          </div>
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