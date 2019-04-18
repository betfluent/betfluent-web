// @flow

import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { Tabs, Tab } from "material-ui/Tabs";
import Divider from "material-ui/Divider";
import { getAllPublicUserBtbStatsForWeekFeed } from "../../Services/DbService";
import { appTheme, gMuiTheme } from "../Styles";
import Leaderboard from "./Leaderboard";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import Avatar from "../Avatar";
import Predictions from "./Predictions";
import Rules from "./Rules";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;
const desktopBreakPoint = gMuiTheme.palette.desktopBreakPoint;

type BTBProps = {
  user: User,
  size: number
};

export default class BTB extends Component<BTBProps> {
  constructor() {
    super();
    this.onBtbStatsChange = this.onBtbStatsChange.bind(this);
    this.setClasses = this.setClasses.bind(this);
    this.state = {
      activeTab: "rules"
    };
  }

  componentDidMount() {
    this.setState({
      activeTab: window.location.hash.replace("#", "") || "rules"
    });
    this.btbStatsFeed = getAllPublicUserBtbStatsForWeekFeed(
      Date.now(),
      this.onBtbStatsChange
    );
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
  }

  componentDidUpdate() {
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
  }

  componentWillUnmount() {
    if (this.btbStatsFeed) this.btbStatsFeed.off();
  }

  onBtbStatsChange(allPublicUsers) {
    this.setState({ allPublicUsers });
  }

  setClasses() {
    const tabDiv = document.getElementById("PortfolioDetail");
    if (tabDiv) {
      const innerDiv = tabDiv.childNodes[0];
      if (innerDiv) {
        const tabTitle = innerDiv.childNodes[0];
        const tabInk = innerDiv.childNodes[1];
        if (tabTitle && tabInk) {
          this.classesSet = true;
          const tabWrapper = document.createElement("div");
          tabTitle.parentNode.insertBefore(tabWrapper, tabTitle);
          tabWrapper.appendChild(tabTitle);
          tabInk.parentNode.insertBefore(tabWrapper, tabInk);
          tabWrapper.appendChild(tabInk);
          tabWrapper.classList.add("content");
          tabTitle.style.margin = "0 auto";
          tabInk.style.margin = "0 auto";
        }
      }
    }
    let buttonDiv = document.getElementById("LeaderboardTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
    buttonDiv = document.getElementById("ActivityTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
  }

  changeTab = e => {
    const activeTab = e.props.label.toLowerCase();
    window.location.hash = activeTab;
    this.setState({ activeTab });
  };

  renderTabContentContainer() {
    if (
      this.rulesContainer &&
      this.leaderboardContainer &&
      this.activityContainer
    ) {
      const rulesContainer = this.rulesContainer;
      const leaderboardContainer = this.leaderboardContainer;
      const activityContainer = this.activityContainer;
      const rulesRect = rulesContainer.getBoundingClientRect();
      rulesContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - rulesRect.top
          : window.innerHeight - rulesRect.top - 56
      }px`;
      leaderboardContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - rulesRect.top
          : window.innerHeight - rulesRect.top - 56
      }px`;
      activityContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - rulesRect.top
          : window.innerHeight - rulesRect.top - 56
      }px`;
    }
  }

  render() {
    if (!this.props.user || !this.state)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    const user = this.props.user;

    const reduceStats = (accumulator, stat) => {
      /* eslint-disable no-param-reassign */
      Object.keys(stat).forEach(key => {
        if (typeof stat[key] === "number") {
          accumulator[key] = accumulator[key]
            ? accumulator[key] + stat[key]
            : stat[key];
        } else if (typeof stat[key] === "object") {
          accumulator[key] = accumulator[key]
            ? reduceStats(accumulator[key], stat[key])
            : reduceStats({}, stat[key]);
        }
      });
      return accumulator;
      /* eslint-enable no-param-reassign */
    };
    const lifetimeStats = user.public.predictionStats.reduce(
      (lifetime, stat) => reduceStats(lifetime, stat),
      {}
    );

    const openSize = this.props.size < desktopBreakPoint ? "100%" : 480;

    const renderStreak = number => {
      if (number > 0) {
        return `W${number}`;
      } else if (number < 0) {
        return `L${Math.abs(number)}`;
      }
      return 0;
    };

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

    const tabBarStyle = {
      width: openSize,
      height: "48px"
    };

    const tabContentContainerStyle = {
      paddingTop: 16,
      overflowY: "scroll",
      boxSizing: "border-box"
    };

    const pointsStyle = {
      color: themeColor
    };

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div
          style={{
            height: this.props.size > mobileBreakPoint ? "100vh" : "100%",
            overflowY: "hidden",
            position: "relative"
          }}
        >
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
          <div className="PortfolioHeader">
            <div
              className="contentHeader flexContainer"
              style={{ justifyContent: "flex-start" }}
            >
              <Avatar
                width={80}
                userName={user.name}
                userAvatar={user.public.avatarUrl}
              />
              <div style={{ flex: 1 }}>
                <div style={titleStyle}>
                  {user.public.name}
                  <span style={pointsStyle}>
                    {" "}
                    {"\u00B7"} {lifetimeStats.points || 0}
                    <span style={{ fontSize: 12 }}> pts</span>
                  </span>
                </div>
                <div style={subtitleStyle}>
                  <span style={{ color: themeColor }}>
                    {lifetimeStats.rightCount || 0} correct {"\u00B7"}{" "}
                  </span>
                  <span style={{ color: textColor2 }}>
                    {lifetimeStats.wrongCount || 0} wrong {"\u00B7"}{" "}
                    {lifetimeStats.pushCount || 0} ties
                  </span>
                </div>
                <br />
                <div style={subtitleStyle}>
                  <span style={{ color: textColor2 }}>
                    Current Streak: {renderStreak(lifetimeStats.currentStreak)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: 0 }} />
          <div>
            <div className="FillEdges" />
            <div id="PortfolioDetail">
              <Tabs
                value={this.state.activeTab}
                inkBarStyle={{ background: themeColor }}
                tabItemContainerStyle={tabBarStyle}
              >
                <Tab
                  label="Rules"
                  id="RulesTab"
                  value="rules"
                  onActive={this.changeTab}
                >
                  <div
                    style={tabContentContainerStyle}
                    ref={rulesContainer => {
                      this.rulesContainer = rulesContainer;
                    }}
                  >
                    <Rules size={this.props.size} />
                  </div>
                </Tab>
                <Tab
                  label="LEADERBOARD"
                  id="LeaderboardTab"
                  value="leaderboard"
                  onActive={this.changeTab}
                >
                  <div
                    style={tabContentContainerStyle}
                    ref={leaderboardContainer => {
                      this.leaderboardContainer = leaderboardContainer;
                    }}
                  >
                    <Leaderboard allPublicUsers={this.state.allPublicUsers} />
                  </div>
                </Tab>
                <Tab
                  label="Activity"
                  id="ActivityTab"
                  value="activity"
                  onActive={this.changeTab}
                >
                  <div
                    style={{ ...tabContentContainerStyle, paddingTop: 0 }}
                    ref={activityContainer => {
                      this.activityContainer = activityContainer;
                    }}
                  >
                    <Predictions
                      size={this.props.size}
                      user={this.props.user}
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  }
}
