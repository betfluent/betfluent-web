// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "material-ui/Card";
import { IntlProvider, FormattedNumber } from "react-intl";
import { gMuiTheme } from "../Styles";

type ReturnProps = {
  user: User,
  fund: Fund
};

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

export default class Return extends Component<ReturnProps> {
  getPctReturn() {
    const pct =
      this.props.user.returns[this.props.fund.id] /
        this.props.user.investments[this.props.fund.id] -
      1;
    if (pct === 0) {
      return "Push";
    }
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
      color: this.getPctReturn() >= 0 ? themeColor : alertColor
    };

    const amountStyle = {
      fontSize: 14,
      fontWeight: 500
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
          <IntlProvider locale="en">
            <div style={{ float: "right" }}>
              {isNaN(this.getPctReturn(fund)) ? (
                <span
                  style={{ fontSize: 12, marginRight: 10, color: textColor3 }}
                >
                  Push
                </span>
              ) : (
                <span style={pctStyle}>
                  <FormattedNumber
                    style="percent"
                    minimumFractionDigits={2}
                    value={this.getPctReturn(fund)}
                  />
                </span>
              )}
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
