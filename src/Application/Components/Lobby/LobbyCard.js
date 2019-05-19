// @flow

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader } from "material-ui/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "material-ui/Divider";
import moment from "moment";
import Moment from "react-moment";
import { IntlProvider, FormattedNumber } from "react-intl";
import Alarm from "material-ui/svg-icons/action/alarm";
import { gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import OdometerExt from "../../Extensions/OdometerExt";
import CountDown from "../CountDown";
import Team from "../Fund/Team";
import "./LobbyCard.css";

const maxInvestment = fund => {
    if (!fund.amountWagered) return 0;
    return fund.amountWagered / fund.maxBalance * 100;
}

const renderTime = closingTime => {
    const diff = closingTime - Date.now() / 1000;
    if (diff / 3600 > 1) {
        return <Moment key={0} fromNow ago date={closingTime * 1000} />;
    }
    return <CountDown diff={diff} />;
}

const renderCardContent = ({ fund }) => {
    const game = fund.fundDetails.potentialGames[0];
    return (
        <div className="poolCardContent">
            <div className="pool-badges" />
            <div className="poolDetail">
                <div className="pool-title">
                    {fund.name}
                </div>
                <div className="pool-game">
                    <Team
                        team={game.awayTeamId}
                        game={game}
                        noName
                    />
                    <div className="pool-details">
                        <div className="team-name">{game.awayTeamAlias}</div>
                        {moment(game.scheduledTimeUnix).format('hh:mm a z')}
                        <div className="team-name">{game.homeTeamAlias}</div>
                    </div>
                    <Team
                        team={game.homeTeamId}
                        game={game}
                        noName
                    />
                </div>
            </div>
        </div>
    );
}

const cardHeaderStyle = {
    textAlign: "left",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "8px",
    paddingBottom: "10px"
};

const cardHeaderTitleStyle = {
    color: gMuiTheme.palette.textColor3,
    display: "inline",
    fontSize: 12,
    fontWeight: 400
};

const wagerRatioStyle = {
    position: "absolute",
    right: 14,
    display: "inline",
    top: 13
};

const alarmStyle = {
    height: 16,
    verticalAlign: "bottom",
    marginLeft: 6,
    marginBottom: -1,
    fill: gMuiTheme.palette.textColor3
};

const timeStyle = {
    position: "absolute",
    bottom: 10
};

const mainStyle = {
    height: 198,
    width: 352,
    margin: "0 16px",
    position: "relative"
};

  const WagerRatio = props => {
    return (
    <div style={props.wagerRatioStyle}>
      <span
        style={{
          color: props.isManager
            ? mgMuiTheme.palette.themeColor
            : gMuiTheme.palette.themeColor
        }}
      >
        $<OdometerExt
          value={props.fund.amountWagered ? props.fund.amountWagered / 100 : 0}
          format="(,ddd)"
        />
      </span>
      <span
        style={{
          color: props.isManager
            ? mgMuiTheme.palette.textColor3
            : gMuiTheme.palette.textColor3
        }}
      >
        {" / "}
        <FormattedNumber
          style="currency"
          currency="USD"
          minimumFractionDigits={0}
          value={props.fund.maxBalance / 100}
        />
      </span>
    </div>
  )
}

  const LobbyCard = ({ fund, user, onClick }) => {
    const linearStyle = {
        position: "absolute",
        right: 20,
        display: "inline",
        width: 48,
        height: 8,
        borderRadius: 6,
        top: 15,
        backgroundColor: user && user.isManager
            ? "rgba(17,204,136,0.2)"
            : "rgba(90,150,255,0.2)"
    };
    
    return (
        <React.Fragment>
            <Link key={fund.id} to={`/pools/${fund.id}`}>
                <IntlProvider locale="en">
                    <Card
                    style={mainStyle}
                    zDepth={2}
                    className="FundCardItem"
                    >
                    <CardHeader
                        title={[
                        <Alarm key={11} style={alarmStyle} />,
                        <span key={10} style={timeStyle}>
                            {renderTime(fund.closingTime)} Left
                        </span>,
                        <WagerRatio
                            key={7}
                            isManager={user && user.isManager}
                            fund={fund}
                            wagerRatioStyle={wagerRatioStyle}
                        />
                        ]}
                        titleStyle={cardHeaderTitleStyle}
                        style={cardHeaderStyle}
                    />
                    <Divider />
                    <CardContent>
                        {renderCardContent({ fund, onClick })}
                    </CardContent>
                    </Card>
                </IntlProvider>
            </Link>
            <div className="pool-actions">
                <div id="bet-against" className="pool-action" onClick={onClick(fund)}>
                    BET AGAINST
                </div>
                <div id="bet-with" className="pool-action left-border" onClick={onClick(fund)}>
                    BET WITH
                </div>
            </div>
        </React.Fragment>
    )
  }

  export default LobbyCard;