import React from 'react';
import LobbyCard from './LobbyCard';
import './ManagerRow.css';

const ManagerRow = ({ manager, user }) => {
    return (
        <div className="manager-wrapper">
            <div className="manager-details">
                <img className="manager-avatar" src={manager.avatarUrl} />
                <div className="manager-content">
                    <div className="manager-name">{manager.name}</div>
                    <div className="manager-follow">FOLLOW +</div>
                    <div className="manager-followers">{`${manager.followers || 0} Followers`}</div>
                    <div className="manager-performance">{`Recent Performance`}</div>
                </div>
            </div>
            <div className="pool-wrapper">
                {manager.funds && manager.funds.map((fund, i) => (
                    <LobbyCard key={i} fund={fund} user={user} />
                ))}
            </div>
        </div>
    )
}

export default ManagerRow;