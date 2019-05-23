// @flow
/* eslint-disable */

/* eslint-disable */

import React, { Component } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import { gMuiTheme } from "../Styles";
import Avatar from "../Avatar";
import User from "../../Models/User";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;

type UserinfoProps = {
  user: User,
  showRealName: boolean,
  allowUpload: boolean
};

export default class Userinfo extends Component<UserinfoProps> {
  render() {
    const user = this.props.user;

    const titleStyle = {
      fontSize: 20,
      lineHeight: "28px",
      color: textColor1,
      fontWeight: 500
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor2,
      fontWeight: 400
    };

    const returnKeys = this.props.user.returns
      ? Object.keys(this.props.user.returns)
      : [];
    const investments = this.props.user.investments
      ? Object.keys(this.props.user.investments).reduce((total, key) => {
          if (!returnKeys.includes(key))
            return total + Math.abs(this.props.user.investments[key]);
          return total;
        }, 0)
      : 0;

    return (
      <IntlProvider locale="en">
        <div className="flexContainer" style={{ justifyContent: "flex-start" }}>
          <Avatar
            width={80}
            userName={user.name}
            userAvatar={user.public.avatarUrl}
            key={user.public.avatarUrl}
            allowUpload={this.props.allowUpload}
          />
          <div>
            {this.props.showRealName ? (
              <div>
                <div style={titleStyle}>
                  {this.props.user.public.name
                    ? this.props.user.public.name
                    : null}
                </div>
                <div style={subtitleStyle}>
                  {this.props.user.name ? this.props.user.name : null}
                </div>
              </div>
            ) : (
              <div style={titleStyle}>
                {this.props.user.public.name
                  ? this.props.user.public.name
                  : null}
              </div>
            )}

            <div style={subtitleStyle}>
              {this.props.user.email ? this.props.user.email : null}
            </div>

            <div style={{ padding: this.props.showRealName ? 4 : 12 }} />

            <div style={titleStyle}>
              <span style={{ color: textColor2 }}>
                <FormattedNumber
                  style="currency"
                  currency="USD"
                  minimumFractionDigits={2}
                  value={this.props.user.balance / 100}
                />{" "}
                {"\u00B7"}{" "}
              </span>
              <span style={{ color: themeColor }}>
                <FormattedNumber
                  style="currency"
                  currency="USD"
                  minimumFractionDigits={2}
                  value={investments / 100}
                />
              </span>
            </div>
            <div style={subtitleStyle}>
              <span>Available {"\u00B7"} </span>
              <span style={{ color: themeColor }}>Wagered</span>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
