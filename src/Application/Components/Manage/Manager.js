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
import PromoteDialog from './PromoteDialog';
import * as spinner from "../../../Assets/spinner.json";
import { LocationService } from "../../Services/BackendService";

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
    this.handleClose = this.handleClose.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onFundsChange = this.onFundsChange.bind(this);
  }

  componentWillMount() {
    if (this.props.isManager && this.props.user && this.props.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        this.props.user.manager.id,
        this.onFundsChange
      );
    } else {
      if (!this.state || !this.state.showModal) this.setState({ showModal: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isManager && nextProps.user && nextProps.user.manager && !this.fundsFeed) {
      this.fundsFeed = getFundsFeed(
        nextProps.user.manager.id,
        this.onFundsChange
      );
    } else {
      if (!this.state || !this.state.showModal) this.setState({ showModal: true })
    }
  }

  componentWillUnmount() {
    if (this.fundsFeed) this.fundsFeed.off();
  }

  componentDidMount() {
    LocationService().then(ok => this.setState({ ok, showModal: true }));
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

  handleClose() {
    this.setState({ showModal: false });
    this.props.history.goBack();
  }

  render() {
    if (!this.state || this.state.ok === undefined) {
      return (
        <div style={{ padding: "8px 0" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );
    }

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

    if (!this.state.fundsCount || this.state.ok === false) {
      return (
        <PromoteDialog
          open={this.state.showModal}
          handleClose={this.handleClose}
          user={this.props.user}
          approved={this.state.ok}
          authUser={this.props.authUser}
        />
      )
    }

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
              label={openFundTabLabel}
              id="OpenTab"
              onActive={() => {
                this.onTabChange(0);
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
                this.onTabChange(1);
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
                this.onTabChange(2);
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
