// @flow
/* eslint-disable */

import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import { FormattedNumber } from "react-intl";
import Alert from "@material-ui/icons/ErrorOutline";
import { gMuiTheme } from "../Styles";
import { mgMuiTheme } from "../ManagerStyles";
import OdometerExt from "../../Extensions/OdometerExt";
import Fund from "../../Models/Fund";

const themeColor = gMuiTheme.palette.themeColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;

type WagerStatProps = {
  fund: Fund,
  isManager: boolean,
  userCurrent: number,
  userWager: number
};

export default (props: WagerStatProps) => {
  const labelStyle = {
    display: "block",
    textAlign: "left",
    fontSize: 12,
    lineHeight: "16px"
  };

  const linearStyle = {
    display: "inline",
    position: "absolute",
    marginTop: 4,
    marginLeft: 4,
    width: 64,
    height: 8,
    borderRadius: 8,
    backgroundColor: props.isManager
      ? "rgba(17,204,136,0.2)"
      : "rgba(90,150,255,0.2)"
  };

  const triStyle = {
    fontSize: 6,
    padding: 4,
    position: "relative",
    top: -2
  };

  let amountWagered = 0;
  let amountCurrent = 0;

  if (props.isManager) {
    amountWagered = props.fund.amountWagered / 100;
    amountCurrent = props.fund.absValue() / 100;
  } else {
    amountWagered = props.userWager;
    amountCurrent = props.userCurrent;
  }

  const investmentProgress = () => {
    if (!props.fund.amountWagered) return 0;
    return props.fund.amountWagered / props.fund.maxBalance * 100;
  };

  const returnPct = () => {
    if (amountWagered === 0) {
      return 0;
    }
    return Math.abs(amountCurrent - amountWagered) / amountWagered;
  };

  const renderColor = () => {
    if (props.fund.status === "OPEN" || props.fund.status === "STAGED") {
      if (props.isManager) return managerThemeColor;
      return themeColor;
    }
    if (amountCurrent - amountWagered >= 0) {
      if (props.isManager) return managerThemeColor;
      return themeColor;
    }
    return alertColor;
  };

  return (
    <div
      style={{
        fontSize: 12,
        lineHeight: "16px",
        color: textColor3,
        marginTop:
          props.fund.status === "OPEN" || props.fund.status === "STAGED"
            ? 16
            : 8
      }}
    >
      <span
        style={{
          fontSize:
            props.fund.status === "OPEN" || props.fund.status === "STAGED"
              ? 12
              : 20,
          lineHeight:
            props.fund.status === "OPEN" || props.fund.status === "STAGED"
              ? "16px"
              : "28px",
          fontWeight:
            props.fund.status === "OPEN" || props.fund.status === "STAGED"
              ? 400
              : 500
        }}
      >
        <span
          style={{
            color: renderColor()
          }}
        >
          $
          <span
            style={{
              display: "inline-block",
              position: "relative",
              bottom:
                props.fund.status === "OPEN" || props.fund.status === "STAGED"
                  ? 0
                  : 2
            }}
          >
            <OdometerExt
              value={
                props.fund.status === "OPEN" || props.fund.status === "STAGED"
                  ? amountWagered
                  : amountCurrent + 0.001
              }
            />
          </span>
        </span>
        <span>
          {" "}
          /{" "}
          <FormattedNumber
            style={"currency"}
            currency="USD"
            minimumFractionDigits={0}
            value={
              props.fund.status === "OPEN" || props.fund.status === "STAGED"
                ? props.fund.maxBalance / 100
                : amountWagered
            }
          />
        </span>
        {props.fund.status === "OPEN" || props.fund.status === "STAGED" ? (
          <LinearProgress
            style={linearStyle}
            mode="determinate"
            value={investmentProgress()}
          />
        ) : null}
      </span>
      <div />
      {props.fund.status !== "OPEN" ? (
        <div style={labelStyle}>
          <div
            style={{
              color: renderColor()
            }}
          >
            <span>
              {props.fund.status === "PENDING" ? "Current" : "Returned"}
            </span>{" "}
            / <span style={{ color: textColor3 }}>Wagered</span>
          </div>
          <div
            style={{
              color: renderColor()
            }}
          >
            <span style={triStyle}>
              {amountCurrent - amountWagered >= 0 ? "▲" : "▼"}
            </span>
            <span>
              <FormattedNumber
                style="percent"
                currency="USD"
                minimumFractionDigits={2}
                value={returnPct()}
              />
            </span>
          </div>
        </div>
      ) : null}
      {props.fund.isTraining ? (
        <div className="moneyAlert">
          <span style={{ color: textColor2 }}>
            <Alert style={{ fontSize: 16, marginBottom: -4 }} />
            The money is simulated, but the bets are on real games.
          </span>
        </div>
      ) : null}
    </div>
  );
};
