// @flow

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider, FormattedNumber } from "react-intl";
import Divider from "material-ui/Divider";
import Dialog from "material-ui/Dialog";
import Alarm from "material-ui/svg-icons/action/alarm";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import Moment from "react-moment";
import Lottie from "react-lottie";
import "../../../Styles/Menu.css";
import Summary from "../Fund/Summary";
import Activity from "./Activity";
import Games from "./Games";
import { getNewUid, getFundFeed } from "../../Services/DbService";
import {
  closeFund,
  openFund,
  returnFund,
  getFundBets,
  deleteFund
} from "../../Services/ManagerService";
import { mgMuiTheme } from "../ManagerStyles";
import Manager from "../../Models/Manager";
import * as spinner from "../../../Assets/spinner.json";
import MainButton from "../../Extensions/FloatingMenuMain";
import ChildButton from "../../Extensions/FloatingMenuElement";
import Menu from "../../Extensions/FloatingMenu";
import FundDetailHeader from "../Fund/FundDetailHeader";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;
const mobileBreakPoint = mgMuiTheme.palette.mobileBreakPoint;
const desktopBreakPoint = mgMuiTheme.palette.desktopBreakPoint;

const spinnerOptions = {
  loop: true,
  autoplay: true,
  animationData: spinner
};

type DialogProps = {
  confirmationAction: (fundId: string) => void,
  handleClose: () => void,
  openConfirmation: boolean,
  action: string,
  errorMessage: string,
  isTraining: boolean
};

const ConfirmationDialog = (props: DialogProps) => {
  const wagerTitleStyle = {
    textAlign: "center"
  };

  const buttonContainerStyle = {
    position: "absolute",
    bottom: 15,
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    textAlign: "center"
  };

  const buttonStyle = {
    position: "relative",
    display: "block"
  };

  const modalStyle = {
    width: 350
  };

  const actions = [
    <RaisedButton
      key={0}
      label={`Confirm ${props.action}`}
      style={buttonStyle}
      primary
      fullWidth
      onClick={props.confirmationAction}
    />,
    <FlatButton
      key={1}
      label="CANCEL"
      style={buttonStyle}
      labelStyle={{ color: alertColor }}
      fullWidth
      onClick={props.handleClose}
    />
  ];

  if (props.isTraining && props.action === "return") {
    return (
      <Dialog
        title="Please Confirm"
        titleStyle={wagerTitleStyle}
        actions={
          <RaisedButton
            label="Got it"
            style={buttonStyle}
            primary
            fullWidth
            onClick={props.handleClose}
          />
        }
        actionsContainerStyle={buttonContainerStyle}
        modal
        open={props.openConfirmation}
        bodyStyle={{ height: 225, overflowX: "hidden" }}
        contentStyle={modalStyle}
        paperProps={{ style: { height: 225 } }}
        style={{ overflowY: "scroll" }}
      >
        <div>You cannot manually return a training fund</div>
      </Dialog>
    );
  }

  if (props.action === "stageBet") {
    return (
      <Dialog
        title="Please Confirm"
        titleStyle={wagerTitleStyle}
        actions={
          <RaisedButton
            label="Got it"
            style={buttonStyle}
            primary
            fullWidth
            onClick={props.handleClose}
          />
        }
        actionsContainerStyle={buttonContainerStyle}
        modal
        open={props.openConfirmation}
        bodyStyle={{ height: 225, overflowX: "hidden" }}
        contentStyle={modalStyle}
        paperProps={{ style: { height: 225 } }}
        style={{ overflowY: "scroll" }}
      >
        <div>
          You have already placed 10 bets. Once your account has been reviewed,
          we will contact you!
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      title="Please Confirm"
      titleStyle={wagerTitleStyle}
      actions={actions}
      actionsContainerStyle={buttonContainerStyle}
      modal
      open={props.openConfirmation}
      bodyStyle={{ height: 225, overflowX: "hidden" }}
      contentStyle={modalStyle}
      paperProps={{ style: { height: 225 } }}
      style={{ overflowY: "scroll" }}
    >
      {props.errorMessage ? (
        <div style={{ color: alertColor }}>{props.errorMessage}</div>
      ) : (
        <div>Are you sure you want to {props.action} this fund?</div>
      )}
    </Dialog>
  );
};

type FundProps = {
  user: Manager,
  location: {},
  history: {
    push: () => void
  },
  size: number,
  computedMatch: {
    params: {
      fund: string
    }
  }
};

export default class FundDetail extends Component<FundProps> {
  constructor(props) {
    super(props);
    this.fundId = props.computedMatch.params.fund;
    this.onFundChange = this.onFundChange.bind(this);
    this.navBack = this.navBack.bind(this);
    this.closeOpenFund = this.closeOpenFund.bind(this);
    this.openStagedFund = this.openStagedFund.bind(this);
    this.returnFund = this.returnFund.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteStagedFund = this.deleteStagedFund.bind(this);
    this.renderTabContentContainer = this.renderTabContentContainer.bind(this);
    this.state = {
      wagering: false,
      confirmDelete: false,
      confirmClose: false,
      confirmOpen: false,
      confirmReturn: false,
      returnFundError: null,
      confirmStage: false
    };
  }

  componentWillMount() {
    this.fundFeed = getFundFeed(this.fundId, this.onFundChange);
  }

  componentDidMount() {
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
  }

  componentDidUpdate() {
    if (!this.classesSet) this.setClasses();
    this.renderTabContentContainer();
  }

  componentWillUnmount() {
    if (this.fundFeed) this.fundFeed.off();
  }

  onFundChange(fund) {
    if (
      fund.status === "STAGED" ||
      fund.status === "OPEN" ||
      fund.status === "PENDING"
    ) {
      getFundBets(fund.id).then(bets => {
        if (bets) {
          const games = fund.games || {};
          const stagedBets = {};
          bets.filter(bet => bet.status === "STAGED").forEach(bet => {
            games[bet.gameId] = bet.gameLeague.toLowerCase();
            stagedBets[bet.id] = bet.pctOfFund;
          });
          fund.games = games;
          fund.stagedBets = stagedBets;
        }
        this.setState({ fund });
      });
    } else {
      this.setState({ fund });
    }
  }

  setClasses = () => {
    const tabDiv = document.getElementById("FundDetail");
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
    let buttonDiv = document.getElementById("SummaryTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
    buttonDiv = document.getElementById("ActivityTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
    buttonDiv = document.getElementById("GameTab");
    if (buttonDiv) {
      buttonDiv.childNodes[0].childNodes[0].style.height = "16px";
    }
  };

  betsCount = () => {
    const fund = this.state.fund;
    let count = 0;
    if (fund.wagers || fund.stagedBets) {
      count = fund.wagers ? Object.keys(fund.wagers).length : 0;
      count += fund.stagedBets ? Object.keys(fund.stagedBets).length : 0;
    }
    return count;
  };

  confirmDelete() {
    const confirmDelete = true;
    this.setState({ confirmDelete });
  }

  deleteStagedFund() {
    if (this.state && this.state.fund) {
      deleteFund(this.state.fund.id);
    }
    this.props.history.push("/manage");
  }

  closeOpenFund() {
    closeFund(this.state.fund.id);
  }

  openStagedFund() {
    openFund(this.state.fund.id);
  }

  returnFund() {
    const payLoad = {
      id: getNewUid(),
      serviceType: "RETURN",
      deviceLocation: this.props.location,
      request: this.fundId
    };
    returnFund(payLoad)
      .then(response => {
        if (response.status === "fail") {
          this.setState({ returnFundError: response.message });
        } else {
          this.setState({ returnFundError: null, confirmReturn: false });
        }
      })
      .catch(err => {
        this.setState({ returnFundError: err.message });
      });
  }

  navBack() {
    switch (this.state.fund.status) {
      case "STAGED":
        this.props.history.push("/manage#0");
        break;
      case "OPEN":
        this.props.history.push("/manage#1");
        break;
      case "PENDING":
        this.props.history.push("/manage#2");
        break;
      case "RETURNED":
        this.props.history.push("/manage#3");
        break;
      default:
        this.props.history.push("/manage");
    }
  }

  stageBet() {
    const betsCount = this.betsCount();
    if (
      (this.state.fund.isTraining && betsCount < 10) ||
      !this.state.fund.isTraining
    ) {
      this.props.history.push(`${this.fundId}/bet#staged`);
    } else {
      this.setState({ confirmStage: true });
    }
  }

  investmentProgress() {
    const fund = this.state.fund;
    if (!fund.amountWagered) return 0;
    return fund.amountWagered / fund.maxBalance * 100;
  }

  renderTabContentContainer() {
    if (
      this.gamesContainer &&
      this.summaryContainer &&
      this.activityContainer
    ) {
      const gamesContainer = this.gamesContainer;
      const summaryContainer = this.summaryContainer;
      const activityContainer = this.activityContainer;
      const gamesRect = gamesContainer.getBoundingClientRect();
      gamesContainer.style.height = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - gamesRect.top
          : window.innerHeight - gamesRect.top - 56
      }px`;
      summaryContainer.style.height = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - gamesRect.top
          : window.innerHeight - gamesRect.top - 56
      }px`;
      activityContainer.style.height = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - gamesRect.top
          : window.innerHeight - gamesRect.top - 56
      }px`;
    }
  }

  renderMenu = () => {
    if (this.state.fund.status === "STAGED") {
      return (
        <div>
          <Menu effect="slidein-spring" position="br" method="hover">
            <MainButton
              iconActive="managerSizeIcon"
              iconResting="managerSizeIcon"
            />
            <ChildButton
              icon="ballot"
              iconClass="managerSizeIcon"
              label="Stage Bet"
              onClick={() => {
                this.stageBet();
              }}
            />
            <ChildButton
              onClick={() => {
                this.setState({ confirmOpen: true });
              }}
              style={{ backgroundColor: "white" }}
              iconClass="managerGreenIcon managerSizeIcon"
              icon="publish"
              label="Open Fund"
            />
            <ChildButton
              href={`/manage/pools/${this.fundId}/edit`}
              style={{ backgroundColor: "white" }}
              icon="edit"
              iconClass="managerGreenIcon managerSizeIcon"
              label="Edit Pool Details"
            />
            <ChildButton
              href={`/manage/pools/${this.fundId}/edit#summary`}
              style={{ backgroundColor: "white" }}
              icon="list_alt"
              iconClass="managerGreenIcon managerSizeIcon"
              label="Edit Pool Summary"
            />
            <ChildButton
              onClick={this.confirmDelete}
              style={{ backgroundColor: "#d50000" }}
              icon="delete"
              iconClass="managerSizeIcon"
              label="Delete Fund"
            />
          </Menu>
          <ConfirmationDialog
            action="open"
            openConfirmation={this.state.confirmOpen}
            confirmationAction={this.openStagedFund}
            handleClose={() => {
              this.setState({ confirmOpen: false });
            }}
          />
        </div>
      );
    }
    if (this.state.fund.status === "OPEN") {
      return (
        <div>
          <Menu effect="slidein" position="br" method="hover">
            <MainButton
              iconActive="managerSizeIcon"
              iconResting="managerSizeIcon"
            />
            <ChildButton
              icon="ballot"
              iconClass="managerSizeIcon"
              label="Stage Bet"
              onClick={() => {
                this.stageBet();
              }}
            />
            <ChildButton
              href={`/manage/pools/${this.fundId}/edit#summary`}
              style={{ backgroundColor: "white" }}
              icon="list_alt"
              iconClass="managerGreenIcon managerSizeIcon"
              label="Edit Pool Summary"
            />
            <ChildButton
              label="Close Pool"
              icon="highlight_off"
              style={{ backgroundColor: "white" }}
              iconClass="managerSizeIcon managerGreenIcon"
              onClick={() => {
                this.setState({ confirmClose: true });
              }}
            />
          </Menu>
          <ConfirmationDialog
            action="close"
            openConfirmation={this.state.confirmClose}
            confirmationAction={this.closeOpenFund}
            handleClose={() => {
              this.setState({ confirmClose: false });
            }}
          />
        </div>
      );
    }
    if (this.state.fund.status === "PENDING") {
      return (
        <div>
          <Menu effect="slidein" position="br" method="hover">
            <MainButton
              iconActive="managerSizeIcon"
              iconResting="managerSizeIcon"
            />
            <ChildButton
              icon="ballot"
              iconClass="managerSizeIcon"
              label="Stage Bet"
              onClick={() => {
                this.stageBet();
              }}
            />
            <ChildButton
              href={`/manage/pools/${this.fundId}/edit#summary`}
              style={{ backgroundColor: "white" }}
              icon="list_alt"
              iconClass="managerGreenIcon managerSizeIcon"
              label="Edit Fund Summary"
            />
            <ChildButton
              label="Return Fund"
              icon="keyboard_return"
              style={{ backgroundColor: "white" }}
              iconClass="managerSizeIcon managerGreenIcon"
              onClick={() => {
                this.setState({ confirmReturn: true });
              }}
            />
          </Menu>
          <ConfirmationDialog
            action="return"
            isTraining={this.state.fund.isTraining}
            openConfirmation={this.state.confirmReturn}
            confirmationAction={this.returnFund}
            errorMessage={this.state.returnFundError}
            handleClose={() => {
              this.setState({ confirmReturn: false, returnFundError: null });
            }}
          />
        </div>
      );
    }

    if (this.props.user.manager.isTraining || this.state.fund.isTraining)
      return null;

    return (
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: "50%",
          zIndex: 1100,
          transform: "translateX(-50%)"
        }}
      >
        <Link to={`/manage/pools/create#${this.fundId}`}>
          <RaisedButton label="Recreate" primary />
        </Link>
      </div>
    );
  };

  render() {
    if (!this.state || !this.state.fund || !this.props.user)
      return (
        <div style={{ position: "absolute", top: "50vh", left: "58%" }}>
          <Lottie options={spinnerOptions} width={20} />
        </div>
      );

    const fund = this.state.fund;
    let userWager;
    let userCurrent;

    if (fund.open) {
      userWager = fund.amountWagered ? fund.amountWagered / 100 : 0;
    } else {
      userWager = fund.amountWagered / 100;
      userCurrent = fund.balance / 100;
    }

    const openSize = this.props.size < desktopBreakPoint ? "100%" : 320;
    const closedSize = this.props.size < desktopBreakPoint ? "100%" : 480;
    const tabBarStyle = {
      width: fund.status === "OPEN" ? openSize : closedSize,
      height: "48px"
    };

    const titleStyle = {
      fontSize: 20,
      lineHeight: "28px",
      fontWeight: 500
    };

    const subtitleStyle = {
      fontSize: 12,
      lineHeight: "16px",
      color: textColor3,
      fontWeight: 400
    };

    const alarmStyle = {
      height: 16,
      fill: themeColor,
      marginBottom: -3
    };

    const tabContentContainerStyle = {
      paddingTop: 16,
      overflowY: "scroll",
      boxSizing: "border-box"
    };

    const SubTitle = () => (
      <div style={subtitleStyle}>
        {`${fund.league} ${fund.type}`}
        <br />
        {fund.status !== "RETURNED"
          ? [
              fund.amountWagered ? fund.playerCount : "0",
              " Players \u00B7 $",
              fund.minInvestment / 100,
              " Minimum / ",
              <FormattedNumber
                key={0}
                style="currency"
                currency="USD"
                minimumFractionDigits={0}
                value={fund.maxInvestment / 100}
              />,
              " Maximum \u00B7 ",
              fund.percentFee,
              "% Fee"
            ]
          : [
              fund.amountWagered ? fund.playerCount : "0",
              " Players \u00B7 ",
              <span key={0} style={{ color: textColor3 }}>
                {this.betsCount()} Bet{this.betsCount() !== 1 ? "s" : null}
              </span>,
              " \u00B7 ",
              <FormattedNumber
                key={1}
                style="currency"
                currency="USD"
                minimumFractionDigits={0}
                value={fund.managerReturn() / 100}
              />,
              " Profit"
            ]}
      </div>
    );

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <IntlProvider locale="en">
          <div>
            <div className="FundHeader">
              <div className="contentHeader">
                <div>
                  <NavigationArrowBack
                    className="navbackArrow"
                    onClick={this.navBack}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: themeColor,
                      float: "right",
                      marginTop: 20
                    }}
                  >
                    {fund.open ? (
                      <span>
                        OPEN <Alarm style={alarmStyle} />
                        <span style={subtitleStyle}>
                          Closing in{" "}
                          <Moment
                            key={0}
                            fromNow
                            ago
                            date={fund.closingTime * 1000}
                          />
                        </span>
                      </span>
                    ) : (
                      fund.status
                    )}
                  </div>
                  <div className="clear" />
                </div>
                <div style={titleStyle}>{fund.name}</div>
                <SubTitle />
                <FundDetailHeader fund={fund} isManager />
              </div>
            </div>
            <Divider />
            <div className="FillEdges" />
            <div id="FundDetail" style={{ position: "relative" }}>
              <Tabs
                inkBarStyle={{ background: themeColor }}
                tabItemContainerStyle={tabBarStyle}
              >
                <Tab label="GAMES" id="GameTab">
                  <div
                    style={tabContentContainerStyle}
                    ref={gamesContainer => {
                      this.gamesContainer = gamesContainer;
                      return gamesContainer;
                    }}
                  >
                    <Games
                      size={this.props.size}
                      games={fund.games}
                      userCurrent={userCurrent}
                      userWager={userWager}
                      fund={fund}
                      user={this.props.user}
                    />
                  </div>
                </Tab>
                <Tab label="SUMMARY" id="SummaryTab">
                  <div
                    style={tabContentContainerStyle}
                    ref={summaryContainer => {
                      this.summaryContainer = summaryContainer;
                      return summaryContainer;
                    }}
                  >
                    <Summary
                      size={this.props.size}
                      fund={fund}
                      user={this.props.user}
                      location={this.props.location}
                      isManager
                      allowComments
                    />
                  </div>
                </Tab>
                <Tab label="ACTIVITY" id="ActivityTab">
                  <div
                    style={tabContentContainerStyle}
                    ref={activityContainer => {
                      this.activityContainer = activityContainer;
                      return activityContainer;
                    }}
                  >
                    <Activity
                      size={this.props.size}
                      user={this.props.user}
                      fund={fund}
                    />
                  </div>
                </Tab>
              </Tabs>
              {this.renderMenu()}
            </div>
            <ConfirmationDialog
              action="delete"
              openConfirmation={this.state.confirmDelete}
              confirmationAction={this.deleteStagedFund}
              handleClose={() => {
                this.setState({ confirmDelete: false });
              }}
            />
            <ConfirmationDialog
              action="stageBet"
              openConfirmation={this.state.confirmStage}
              handleClose={() => {
                this.setState({ confirmStage: false });
              }}
            />
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}
