// @flow

import React, { Component } from "react";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Tabs, Tab } from "material-ui/Tabs";
import Divider from "material-ui/Divider";
import EmptyWork from "material-ui/svg-icons/action/work";
import User from "./User";
import Pendings from "./Pendings";
import Returns from "./Returns";
import { gMuiTheme, appTheme } from "../Styles";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";

const themeColor = gMuiTheme.palette.themeColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;
const desktopBreakPoint = gMuiTheme.palette.desktopBreakPoint;

type PortfolioProps = {
  user: User,
  approved: boolean,
  size: number
};

export default class Portfolio extends Component<PortfolioProps> {
  constructor() {
    super();
    this.setClasses = this.setClasses.bind(this);
    this.state = {
      activeTab: "pending"
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      activeTab: window.location.hash.replace("#", "") || "pending"
    });
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
  }

  componentDidUpdate() {
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
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
    let buttonDiv = document.getElementById("PendingTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
    buttonDiv = document.getElementById("ReturnedTab");
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
    if (this.pendingContainer && this.returnContainer) {
      const pendingContainer = this.pendingContainer;
      const returnContainer = this.returnContainer;
      const pendingRect = pendingContainer.getBoundingClientRect();
      pendingContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - pendingRect.top
          : window.innerHeight - pendingRect.top - 56
      }px`;
      returnContainer.style.maxHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - pendingRect.top
          : window.innerHeight - pendingRect.top - 56
      }px`;
    }
  }

  render() {
    if (!this.props.user) {
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="center-flex" style={{ height: "100vh" }}>
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    const allFundIds = this.props.user.investments
      ? Object.keys(this.props.user.investments)
      : [];
    const returnedFundIds = this.props.user.returns
      ? Object.keys(this.props.user.returns)
      : [];
    const pendingFundIds =
      allFundIds.filter(fundId => !returnedFundIds.includes(fundId)) || [];

    const openSize = this.props.size < desktopBreakPoint ? "100%" : 480;

    const tabBarStyle = {
      width: openSize,
      height: "48px"
    };

    const tabContentContainerStyle = {
      paddingTop: 16,
      overflowY: "scroll",
      boxSizing: "border-box"
    };

    return (
      <OldMuiThemeProvider muiTheme={gMuiTheme}>
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
            <div className="contentHeader">
              <User size={this.props.size} user={this.props.user} />
            </div>
          </div>
          <Divider style={{ marginTop: 0 }} />
          {this.props.user.investments || this.props.user.returns ? (
            <div>
              <div className="FillEdges" />
              <div id="PortfolioDetail">
                <Tabs
                  value={this.state.activeTab}
                  inkBarStyle={{ background: themeColor }}
                  tabItemContainerStyle={tabBarStyle}
                >
                  <Tab
                    label="PENDING"
                    id="PendingTab"
                    value="pending"
                    onActive={this.changeTab}
                  >
                    <div
                      style={tabContentContainerStyle}
                      ref={pendingContainer => {
                        this.pendingContainer = pendingContainer;
                      }}
                    >
                      <Pendings
                        pendingFundIds={pendingFundIds}
                        user={this.props.user}
                      />
                    </div>
                  </Tab>
                  <Tab
                    label="RETURNED"
                    id="ReturnedTab"
                    value="returned"
                    onActive={this.changeTab}
                  >
                    <div
                      style={tabContentContainerStyle}
                      ref={returnContainer => {
                        this.returnContainer = returnContainer;
                      }}
                    >
                      <Returns
                        returnedFundIds={returnedFundIds}
                        user={this.props.user}
                      />
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="emptyPortfolio">
              <EmptyWork />
              {this.props.approved ? (
                <p>
                  There are no pools in you Portfolio. <br /> Explore the lobby
                  and wager on some pools
                </p>
              ) : (
                <p>
                  Pools that you&apos;ve wagered on will appear here. Complete
                  the verification to get in on the action.
                </p>
              )}
            </div>
          )}
        </div>
      </OldMuiThemeProvider>
    );
  }
}
