import React from 'react';
import Moment from 'react-moment';
import * as clock from '../../../../Assets/clock-casino/clock.png';
import twitterLogoBlue from '../../../../Assets/twitterLogoBlue.png';
import CountDown from '../../CountDown';
import './influencer-ad-card.css';

class InfluencerAdCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.setState({
      gamePick: this.props.gamePick
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gamePick !== this.props.gamePick) {
      this.setState({
        gamePick: this.props.gamePick
      })
    }
  }

  render() {
    if (!this.state.gamePick) return null;
    const { gamePick: { fund: { closingTime, manager }, withPct, fadePct, streak, selectedTeam, gameTeams, longBet, gameDescription, gamePickSource } } = this.state;

    const renderTeams = () => {
      if (gameTeams) {
        return (
          <div className='game-teams over-under d-flex align-items-center'>
            <div className='team-avatars align-self-stretch d-flex flex-column justify-content-between align-items-center'>
              <img src={gameTeams.away.avatarUrl} alt='away team' className='team-avatar'/>
              <img src={gameTeams.home.avatarUrl} alt='home team' className='team-avatar'/>
            </div>
            <div className='team-info'>
              <div className='bet-type'>Total</div>
              <div className='game-team-title'>{gameTeams.away.name.substring(0,3)} @ {gameTeams.home.name.substring(0,3)}</div>
              <div className='game-team-subtitle'>
                {longBet.overUnder}
              </div>
            </div>
          </div>
        );
      } else if (longBet.points) {
        return (
          <div className='game-teams d-flex align-items-center'>
            <img src={selectedTeam.avatarUrl} alt='selected team' className='team-avatar'/>
            <div className='team-info'>
              <div className='bet-type'>Spread</div>
              <div className='game-team-title'>{selectedTeam.name}</div>
              <div className='game-team-subtitle'>
                {longBet.points}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className='game-teams d-flex align-items-center'>
            <img src={selectedTeam.avatarUrl} alt='selected team' className='team-avatar'/>
            <div className='team-info'>
              <div className='bet-type'>Moneyline</div>
              <div className='game-team-title'>{selectedTeam.name}</div>
              <div className='game-team-subtitle'>
                (+3.5/-110)
              </div>
            </div>
          </div>
        );
      }
    };

    const renderTimeLeft = () => {
      const diff = closingTime - Date.now() / 1000;
      if (diff < 0) {
        return <div className="time-left in-progress">In Progress</div>;
      }
      if (diff / 3600 > 1) {
        return (
          <div className="time-left d-flex align-items-center">
            <img src={clock} alt="clock" className='clock' />
            <Moment fromNow ago date={closingTime * 1000} />
          </div>
        );
      }
      return (
        <div className="time-left d-flex align-items-center">
          <img src={clock} alt="clock" className='clock' />
          <CountDown diff={diff} hideSeconds />
        </div>
      );
    };

    return (
      <div className="influencer-card-wrapper">
        <div className="influencer-card-avatar-wrapper">
          <img className="influencer-card-avatar" src={manager.avatarUrl} alt="Celebrity Photo" />
        </div>

        <div className='influencer-card-body'>
          <div className="influencer-card-title d-flex justify-content-between">
            <div>{manager.name}</div>
            <a className="twitter-link d-flex align-items-center" href={manager.twitterUrl} target="_blank">
              <img src={twitterLogoBlue} alt="twitter" />
              &nbsp;@{manager.name}
            </a>
          </div>

          <div className="influencer-card-subtitle d-flex align-items-center">
            <span className="influencer-card-subtitle-text d-flex">Last Ten: </span>
            <div className='streak-tags d-flex justify-content-between flex-grow-1'>
              {streak.map((result, i) => <div key={i} className={result === 'W' ? 'streak-tag win' : 'streak-tag loss'}>{result}</div>)}
            </div>
          </div>

          {renderTeams()}

          <div className="influencer-card-game-info"><strong>Game Info:</strong> {gameDescription}</div>

          <div className="influencer-card-status-wrapper">
            <div className="influencer-card-status-title">Current Status</div>
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
              {renderTimeLeft()}
            </div>
          </div>
        </div>

        <div className='influencer-card-footer'>
          <div className='game-pick-source'>
            *Game pick provided by {gamePickSource}.
          </div>
        </div>
      </div>
    )
  }
}

export default InfluencerAdCard;
