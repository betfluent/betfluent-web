// @flow
/* eslint-disable */

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Tabs, Tab } from "material-ui/Tabs";
import groupBy from "lodash/groupBy";
import Lottie from "react-lottie";
import Funds from "./Funds";
import { getFundsFeed } from "../../Services/ManagerService";
import { mgMuiTheme } from "../ManagerStyles";
import Manager from "../../Models/Manager";
import * as spinner from "../../../Assets/spinner.json";

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

const themeColor = mgMuiTheme.palette.themeColor;

type ManageProps = {
  user: Manager,
  size: number,
  history: {
    push: () => voild,
    location: {
      hash: []
    }
  }
};

export default class Manage extends Component<ManageProps> {
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
    this.onFundsChange = this.onFundsChange.bind(this);
  }

  componentWillMount() {
    if (this.props.user && this.props.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        this.props.user.manager.id,
        this.onFundsChange
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        nextProps.user.manager.id,
        this.onFundsChange
      );
    }
  }

  componentWillUnmount() {
    if (this.fundsFeed) this.fundsFeed.off();
  }

  onFundsChange(funds) {
    const fundsGrouped = groupBy(funds, fund => fund.status);
    const playerCounts = {};
    const fundsCount = {};
    Object.keys(fundsGrouped).forEach(key => {
      playerCounts[key] = fundsGrouped[key]
        .map(i => i.playerCount)
        .reduce((t, i) => t + i);
    });
    Object.keys(fundsGrouped).forEach(key => {
      fundsCount[key] = fundsGrouped[key].length;
    });
    this.setState({ playerCounts, fundsCount });
  }

  onTabChange(tab) {
    this.props.history.push(`#${tab}`);
  }

  render() {
    const tabBarStyle = {
      height: 48
    };

    const inkBarStyle = {
      backgroundColor: themeColor
    };

    const tabContentStyle = {
      boxSizing: "border-box",
      height: window.innerHeight - 48,
      overflowY: "scroll",
      paddingBottom: 128
    };

    if (!this.state)
      return (
        <div style={{ position: "absolute", top: "50vh", left: "58%" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );

    const stagedFundCount = this.state.fundsCount.STAGED || 0;
    const openFundCount = this.state.fundsCount.OPEN || 0;
    const pendingFundCount = this.state.fundsCount.PENDING || 0;
    const returnedFundCount = this.state.fundsCount.RETURNED || 0;

    const stagedFundTabLabel = `STAGED (${stagedFundCount})`;
    const openFundTabLabel = `OPEN (${openFundCount})`;
    const pendingFundTabLabel = `PENDING (${pendingFundCount})`;
    const returnedFundTabLabel = `RETURNED (${returnedFundCount})`;

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <div>
          <div className="FillEdges" />
          <Tabs
            tabItemContainerStyle={tabBarStyle}
            inkBarStyle={inkBarStyle}
            initialSelectedIndex={parseInt(
              this.props.history.location.hash.slice(1),
              10
            )}
          >
            <Tab
              label={stagedFundTabLabel}
              id="StagedTab"
              onActive={() => {
                this.onTabChange(0);
              }}
            >
              <div style={tabContentStyle}>
                <Funds
                  status="STAGED"
                  user={this.props.user}
                  size={this.props.size}
                />
              </div>
            </Tab>
            <Tab
              label={openFundTabLabel}
              id="OpenTab"
              onActive={() => {
                this.onTabChange(1);
              }}
            >
              <div style={tabContentStyle}>
                <Funds
                  status="OPEN"
                  user={this.props.user}
                  size={this.props.size}
                />
              </div>
            </Tab>
            <Tab
              label={pendingFundTabLabel}
              id="StagedTab"
              onActive={() => {
                this.onTabChange(2);
              }}
            >
              <div style={tabContentStyle}>
                <Funds
                  status="PENDING"
                  user={this.props.user}
                  size={this.props.size}
                />
              </div>
            </Tab>
            <Tab
              label={returnedFundTabLabel}
              id="OpenTab"
              onActive={() => {
                this.onTabChange(3);
              }}
            >
              <div style={tabContentStyle}>
                <Funds
                  status="RETURNED"
                  user={this.props.user}
                  size={this.props.size}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    );
  }
}
