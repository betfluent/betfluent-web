// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "material-ui/Card";
import { IntlProvider, FormattedNumber } from "react-intl";
import { gMuiTheme } from "../Styles";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

type PendingProps = {
  user: User,
  fund: Fund,
  live: boolean
};

export default class Pending extends Component<PendingProps> {
  getPctReturn(fund) {
    if (fund.results === undefined) {
      return -2;
    }

    const userInvestment = this.props.user.investments[fund.id];
    const pct = fund.userReturn(userInvestment) / userInvestment - 1;
    return pct;
  }

  render() {
    const fund = this.props.fund;
    const user = this.props.user;

    const titleStyle = {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "24px",
      color: textColor1
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor3
    };

    const pctStyle = {
      fontSize: 12,
      marginRight: "10px",
      color: this.getPctReturn(fund) > 0 ? themeColor : alertColor
    };

    const amountStyle = {
      fontSize: 14,
      fontWeight: 500
    };

    const liveStyle = {
      color: themeColor,
      fontSize: 14,
      lineHeight: "24px",
      fontWeight: 500,
      display: "inline-block",
      width: 30
    };

    const cardProgressStyle = {
      float: "right"
    };

    const renderCardProgress = () => {
      if (this.getPctReturn(fund) > -2) {
        if (this.getPctReturn(fund) === 0) {
          return (
            <span style={{ fontSize: 12, marginRight: 10, color: textColor3 }}>
              Push
            </span>
          );
        }
        return (
          <span style={pctStyle}>
            <FormattedNumber
              style="percent"
              minimumFractionDigits={2}
              value={this.getPctReturn(fund)}
            />
          </span>
        );
      }
      return null;
    };

    return (
      <Link key={fund.id} to={`/pools/${fund.id}`}>
        <Card className="PortfolioCard" zDepth={2}>
          <CardTitle
            style={{ padding: 0 }}
            titleStyle={titleStyle}
            title={fund.name}
            subtitle={`${fund.league} ${fund.type}`}
            subtitleStyle={subtitleStyle}
          />
          <div style={liveStyle}>{this.props.live ? "LIVE" : null}</div>
          <IntlProvider locale="en">
            <div style={cardProgressStyle}>
              {renderCardProgress()}
              <span style={amountStyle}>
                <FormattedNumber
                  style="currency"
                  currency="USD"
                  minimumFractionDigits={2}
                  value={fund.userReturn(user.investments[fund.id]) / 100}
                />
              </span>
            </div>
          </IntlProvider>
          <div className="clear" />
        </Card>
      </Link>
    );
  }
}
