// @flow
/* eslint-disable */

import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepContent from "@material-ui/core/StepContent";
import Switch from "@material-ui/core/Switch";
import DatePicker from "material-ui/DatePicker";
import TimePicker from "material-ui/TimePicker";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { IntlProvider, FormattedNumber } from "react-intl";
import { MuiThemeProvider } from "@material-ui/core/styles";
import V0MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import moment from "moment";
import TooltipDrawer from "./TooltipDrawer";
import GamesSelect from "../GamesSelect";
import { mgAppTheme, mgMuiTheme } from "../ManagerStyles";
import FundDetailHeader from "../Fund/FundDetailHeader";
import PotentialGames from "../Shared/PotentialGames";
import Fund from "../../Models/Fund";
import { getFundWithDetails } from "../../Services/DbService";
import {
  createFund,
  updateFundDetails,
  UploadSummaryImage
} from "../../Services/ManagerService";

const themeColor = mgMuiTheme.palette.themeColor;
const textColor1 = mgMuiTheme.palette.textColor1;
const textColor2 = mgMuiTheme.palette.textColor2;
const textColor3 = mgMuiTheme.palette.textColor3;
const alertColor = mgMuiTheme.palette.alertColor;

const subtitleStyle = {
  fontSize: 12,
  lineHeight: "16px",
  color: textColor3,
  fontWeight: 400
};

const titleStyle = {
  fontSize: 20,
  lineHeight: "28px",
  fontWeight: 500,
  color: textColor1,
  marginRight: "30%",
  marginBottom: "16px"
};

const parseNumber = string => Number(string.replace(/,/gi, ""));

const getDateTime = (date, time) => {
  if (!date) return null;
  const momentDate = moment(date || -1);
  const momentTime = moment(time || -1);

  return moment({
    year: momentDate.year(),
    month: momentDate.month(),
    day: momentDate.date(),
    hour: momentTime.hours(),
    minute: momentTime.minutes()
  }).valueOf();
};

type CreateFundProps = {
  user: User,
  history: {
    push: () => void,
    goBack: () => void
  }
};

export default class CreateFund extends Component<CreateFundProps> {
  constructor(props) {
    super(props);
    this.createFund = this.createFund.bind(this);
    this.onGameDateChange = this.onGameDateChange.bind(this);
    this.state = {
      open: false,
      minWager: "10",
      maxWager: "100",
      fundCap: "1,000",
      pctFee: "5%",
      initialSummary: "<p>Please enter your pool summary here...</p>",
      fundSummary: false,
      summaryChanged: false,
      summaryError: null,
      creationStep: "name",
      selectedGames: [],
      inputField: "init",
      activeDateStep: 0,
      openDateTitle: "Select opening date and time",
      closeDateTitle: "Select closing date and time",
      returnDateTitle: "Select returning date and time"
    };
  }

  componentDidMount() {
    const fundId = window.location.hash.replace("#", "");
    if (fundId) {
      getFundWithDetails(fundId).then(fund => {
        this.setState({
          fundId,
          name: fund.name,
          league: fund.league,
          sport: fund.sport,
          minWager: "10",
          maxWager: "100",
          fundCap: "1,000",
          summary: fund.details.summaryHtml
        });
      });
    }
    if (this.props.user.manager.isTraining) {
      const manager = this.props.user.manager;
      const returnDateTime = moment().add(1, "days");
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({
        isTraining: true,
        name: `${manager.name} Training Pool`,
        fundType: "Daily",
        minWager: "10",
        maxWager: "100",
        fundCap: "1,000",
        openImmediately: true,
        closeDate: new Date(),
        closeTime: new Date(),
        returnDate: new Date(returnDateTime),
        returnTime: new Date(returnDateTime),
        initialSummary: "<p>This is a training pool for you.</p>"
      }, () => {
      });
    }
    const input = document.getElementById('fundName');
    if (input) input.setAttribute('maxLength', 28);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.creationStep === 'name' && prevState.creationStep !== 'name') {
      const input = document.getElementById('fundName');
      if (input) input.setAttribute('maxLength', 28);
    }
  }

  onNameChange(event) {
    const name = event.target.value;
    this.setState({ name });
  }

  onLeagueChange = (event, index, value) => {
    const league = value;
    let sport = "Basketball";
    if (league === "NCAAMB" || league === "NBA") {
      sport = "Basketball";
    }
    if (league === "MLB") {
      sport = "Baseball";
    }
    if (league === "FIFA") {
      sport = "Soccer";
    }
    if (league === "NCAAF" || league === "NFL") {
      sport = "Football";
    }
    this.setState({ league, sport });
  };

  // onFundTypeChange = (event, index, value) => {
  //   const fundType = value;
  //   this.setState({ fundType });
  // };

  onMinChange(event) {
    let minWager = event.target.value.replace(/,/gi, "");
    if (minWager) minWager = (parseInt(minWager, 10) || "").toLocaleString();
    this.setState({ minWager });
  }

  onMaxChange(event) {
    let maxWager = event.target.value.replace(/,/gi, "");
    if (maxWager) maxWager = (parseInt(maxWager, 10) || "").toLocaleString();
    this.setState({ maxWager });
  }

  onCapChange(event) {
    let fundCap = event.target.value.replace(/,/gi, "");
    if (fundCap) fundCap = (parseInt(fundCap, 10) || "").toLocaleString();
    this.setState({ fundCap });
  }

  onFeeChange(event) {
    let pctFee = event.target.value.replace(/%/gi, "");
    if (pctFee && pctFee.length >= this.state.pctFee.length) {
      pctFee = parseFloat(pctFee, 10) || "";
      if (pctFee) pctFee = `${pctFee}%`;
    }
    this.setState({ pctFee });
  }

  onGameDateChange(e, gameDate) {
    this.setState({ gameDate, errorTextOpenDate: null });
  }

  dateFormat = date => {
    const currentYear = moment().year();
    const scheduledYear = moment(date).year();
    const format = currentYear === scheduledYear ? "MMMM Do" : "MMMM Do, YYYY";
    return format;
  };

  handleNextDate = () => {
    this.setState({ creationStep: "game" });
  };

  handlePreviousDate = () => {
    if (this.state.activeDateStep === 0) {
      this.setState({ creationStep: "name", inputField: "init" });
    } else {
      this.setState(state => ({
        activeDateStep: state.activeDateStep - 1
      }));
    }
  };

  handleEditorChange = e => {
    const summaryChanged = true;
    const summary = e.target.getContent();
    this.setState({ summary, summaryChanged, summaryError: null });
  };

  createFund() {
    this.setState({ fundCreated: true });

    const firstGame = this.state.selectedGames.sort(
      (a, b) => a.scheduledTimeUnix - b.scheduledTimeUnix
    )[0];
    const gameTime = firstGame.scheduledTimeUnix;
    const poolCloseTime =
      moment(gameTime)
        .subtract(20, "minutes")
        .valueOf() / 1000;

    const fund = {
      amountReturned: 0,
      amountWagered: this.state.isTraining
        ? parseInt(this.state.fundCap.replace(/,/gi, ""), 10) * 100
        : 0,
      balance: this.state.isTraining
        ? parseInt(this.state.fundCap.replace(/,/gi, ""), 10) * 100
        : 0,
      closedTimeMillis: -1,
      closingTime: poolCloseTime,
      counterBalance: 0,
      createdTimeMillis: Date.now(),
      fadePlayerCount: 0,
      fadeReturnCount: 0,
      fadeReturned: 0,
      fadeAmountWagered: 0,
      league: this.state.league,
      name: this.state.name,
      minInvestment: parseInt(this.state.minWager.replace(/,/gi, ""), 10) * 100,
      managerId: this.props.user.manager.id,
      pctOfFeeCommission:
        this.props.user.manager.details.pctOfFeeCommission || 50,
      maxInvestment: parseInt(this.state.maxWager.replace(/,/gi, ""), 10) * 100,
      maxBalance: parseInt(this.state.fundCap.replace(/,/gi, ""), 10) * 100,
      openTimeMillis: -1,
      percentFee: parseInt(this.state.pctFee.slice(0, -1), 10),
      playerCount: 0,
      returnCount: 0,
      returnTimeMillis: -1,
      sport: this.state.sport,
      status: "OPEN",
      type: "Daily",
      isTraining: this.state.isTraining || null
    };
    const fundId = createFund(fund);

    updateFundDetails(fundId, {
      summaryHtml: this.state.summary,
      potentialGames: this.state.selectedGames.reduce((map, game) => {
        map[game.id] = game.league; // eslint-disable-line no-param-reassign
        return map;
      }, {})
    });

    window.setTimeout(() => {
      this.setState({ fundCreated: false });
      if (this.state.openImmediately) {
        this.props.history.push("/manage#1");
      } else {
        this.props.history.push("/manage#0");
      }
    }, 1000);
    return null;
  }

  toDateStep() {
    if (!this.state.name) {
      this.setState({ errorTextName: "Please enter a pool name." });
      return null;
    }
    this.setState({ errorTextName: null });

    if (!this.state.league) {
      this.setState({ errorTextLeague: "Please choose a league." });
      return null;
    }
    this.setState({ errorTextLeague: null });

    // if (!this.state.fundType) {
    //   this.setState({ errorTextType: "Please choose a pool type." });
    //   return null;
    // }
    // this.setState({ errorTextType: null });

    if (!this.state.minWager) {
      this.setState({ errorTextMin: "Please set a minimum wager." });
      return null;
    }
    this.setState({ errorTextMin: null });

    if (!this.state.maxWager) {
      this.setState({ errorTextMax: "Please set a maximum wager." });
      return null;
    }
    this.setState({ errorTextMax: null });

    if (!this.state.fundCap) {
      this.setState({ errorTextCap: "Please set a pool cap." });
      return null;
    }
    this.setState({ errorTextCap: null });

    if (
      this.state.maxWager &&
      this.state.minWager &&
      parseNumber(this.state.maxWager) <= parseNumber(this.state.minWager)
    ) {
      this.setState({
        errorTextMax: "Maximum wager must be greater than minimum wager."
      });
      return null;
    }
    this.setState({
      errorTextMax: null
    });

    if (
      this.state.maxWager &&
      this.state.fundCap &&
      parseNumber(this.state.fundCap) <= parseNumber(this.state.maxWager)
    ) {
      this.setState({
        errorTextCap: "Pool cap must be greater than maximum wager."
      });
      return null;
    }
    this.setState({
      errorTextCap: null
    });

    if (!this.state.pctFee) {
      this.setState({ errorTextFee: "Please set a % fee charged." });
      return null;
    }
    this.setState({ errorTextFee: null });

    this.setState({
      creationStep: "date",
      inputField: "Pool Date/Time"
    });
    return null;
  }

  renderNameStep = props => (
    <V0MuiThemeProvider muiTheme={mgMuiTheme}>
      <div style={props.paperStyle}>
        <div style={props.contentStyle} className="dialogContent">
          <div style={titleStyle}>Create Pool</div>
          <TextField
            id="fundName"
            style={props.rootStyle}
            value={this.state.name}
            onFocus={() => {
              this.setState({ inputField: "Pool Name", errorTextName: null });
            }}
            onChange={event => {
              if (!this.state.isTraining) {
                this.onNameChange(event);
              }
            }}
            className="formInputStyle"
            floatingLabelText="Pool Name"
            errorText={this.state.errorTextName}
            errorStyle={props.errorStyle}
          />
          <SelectField
            id="league"
            className="formInputStyle"
            labelStyle={props.labelStyle}
            iconStyle={props.iconStyle}
            style={props.style}
            floatingLabelText="League"
            value={this.state.league}
            onClick={() => {
              this.setState({ inputField: "League", errorTextLeague: null });
            }}
            onChange={this.onLeagueChange}
            errorText={this.state.errorTextLeague}
          >
            <MenuItem value={"MLB"} primaryText="MLB" />
            <MenuItem value={"NBA"} primaryText="NBA" />
          </SelectField>
          {/* <SelectField
            id="fundType"
            className="formInputStyle"
            labelStyle={props.labelStyle}
            iconStyle={props.iconStyle}
            style={props.style}
            floatingLabelText="Pool Type"
            value={this.state.fundType}
            onClick={() => {
              this.setState({ inputField: "Pool Type", errorTextType: null });
            }}
            onChange={this.onFundTypeChange}
            errorText={this.state.errorTextType}
          >
            <MenuItem value={"Daily"} primaryText="Daily" />
            <MenuItem value={"Weekly"} primaryText="Weekly" />
            <MenuItem value={"Futures"} primaryText="Futures" />
          </SelectField>*/}
          <TextField
            id="minWager"
            style={props.rootStyle}
            value={this.state.minWager}
            onFocus={() => {
              this.setState({
                inputField: "Min Wager",
                errorTextMin: null
              });
            }}
            className="formInputStyle"
            floatingLabelText="Min Wager"
            errorText={this.state.errorTextMin}
            errorStyle={props.errorStyle}
          />
          <TextField
            id="maxWager"
            style={props.rootStyle}
            value={this.state.maxWager}
            onFocus={() => {
              this.setState({
                inputField: "Max Wager",
                errorTextMax: null
              });
            }}
            className="formInputStyle"
            floatingLabelText="Max Wager"
            errorText={this.state.errorTextMax}
            errorStyle={props.errorStyle}
          />
          <TextField
            id="fundCap"
            style={props.rootStyle}
            value={this.state.fundCap}
            onFocus={() => {
              this.setState({ inputField: "Pool Cap", errorTextCap: null });
            }}
            className="formInputStyle"
            floatingLabelText="Pool Cap"
            errorText={this.state.errorTextCap}
            errorStyle={props.errorStyle}
          />
          <TextField
            id="pctFee"
            style={props.rootStyle}
            value={this.state.pctFee}
            onFocus={() => {
              this.setState({
                inputField: "% Fee Charged",
                errorTextFee: null
              });
            }}
            // onChange={event => {this.onFeeChange(event)}}
            className="formInputStyle"
            floatingLabelText="% Fee Charged"
            errorText={this.state.errorTextFee}
            errorStyle={props.errorStyle}
          />
          <div style={{ height: 25 }} />
          <RaisedButton
            primary
            label="NEXT"
            style={{ marginRight: 10 }}
            onClick={() => {
              this.toDateStep();
            }}
          />
        </div>
      </div>
    </V0MuiThemeProvider>
  );

  renderDatePicker = () => {
    const datePickerContainerStyle = {
      justifyContent: "flex-start",
      marginTop: -16
    };

    const datePickerInputStyle = {
      width: 128
    };
    return (
      <div>
        <div className="flexContainer" style={datePickerContainerStyle}>
          <DatePicker
            textFieldStyle={datePickerInputStyle}
            firstDayOfWeek={0}
            floatingLabelText="Opening Date"
            value={this.state.gameDate}
            onChange={this.onGameDateChange}
            errorText={this.state.errorTextOpenDate}
            ref={el => {
              this.openDate = el;
            }}
            textFieldStyle={{
              width: 224
            }}
          />
        </div>
      </div>
    );
  };

  renderDateStep = props => {
    const steps = [
      this.state.openDateTitle,
      this.state.closeDateTitle,
      this.state.returnDateTitle
    ];

    const stepContent = [
      "If an opening time is specified, this Pool will be staged to automatically open at that time. If you choose to open this pool now, it will be immediately available for wagering.",
      "This Pool will be automatically closed at this time. After the pool closes, users may no longer wager and you will be able to place bets.",
      "If a returning time is specified, this Pool will be returned to users automatically and you will no longer be able to place bets afterwards. If you choose to return this pool manually, the betting timeframe will be indefinite and you must return this Pool yourself from the dashboard."
    ];

    return (
      <V0MuiThemeProvider muiTheme={mgMuiTheme}>
        <div style={props.paperStyle}>
          <div style={{ width: "60%", minWidth: 320, margin: "auto" }}>
            <div style={titleStyle}>{this.state.name}</div>
            <MuiThemeProvider theme={mgAppTheme}>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    color: textColor2,
                    fontSize: 14,
                    marginBottom: "8px"
                  }}
                >
                  <div
                    style={{
                      color: textColor1,
                      fontWeight: 500,
                      fontSize: "16px"
                    }}
                  >
                    Choose a game day you wish to place bets on.
                  </div>
                  <div>
                    The calander day you choose will decide what games
                    <br />
                    will be populated for you to bet on.
                  </div>
                </div>
                {this.renderDatePicker()}
                <div>
                  <div>
                    <FlatButton
                      label="Back"
                      onClick={this.handlePreviousDate}
                      primary
                      style={{ margin: "24px 16px 0 0" }}
                    />
                    <RaisedButton
                      label={
                        this.state.activeDateStep === steps.length - 1
                          ? "Finish"
                          : "Next"
                      }
                      primary
                      disabled={!this.state.gameDate}
                      onClick={this.handleNextDate}
                    />
                  </div>
                </div>
              </div>
            </MuiThemeProvider>
          </div>
        </div>
      </V0MuiThemeProvider>
    );
  };

  renderGameStep = () => {
    const { gameDate } = this.state;
    return (
      <GamesSelect
        subtitle="Choose potential games to bet on"
        league={this.state.league}
        gameDate={moment(gameDate).valueOf()}
        preselectedIds={this.state.selectedGames.map(game => game.id)}
        onBackPressed={() => {
          this.setState({
            selectedGames: [],
            creationStep: "date",
            inputField: "Pool Date/Time"
          });
        }}
        onConfirmSelection={selectedGames => {
          this.setState({
            selectedGames,
            creationStep: "summary",
            inputField: "Pool Summary"
          });
        }}
        numberToSelect={1}
      />
    );
  };

  renderSummaryStep = () => {
    const SubTitle = props => (
      <div style={subtitleStyle}>
        {`${this.state.league} ${this.state.fundType}`}
        <br />
        {[
          props.fund.amountWagered ? props.fund.playerCount : "0",
          " Players \u00B7 $",
          props.fund.minWager,
          " Minimum / ",
          <FormattedNumber
            key={0}
            style="currency"
            currency="USD"
            minimumFractionDigits={0}
            value={props.fund.maxWager}
          />,
          " Maximum \u00B7 ",
          props.fund.pctFee,
          " Fee"
        ]}
      </div>
    );

    return (
      <V0MuiThemeProvider muiTheme={mgMuiTheme}>
        <IntlProvider locale="en">
          <div>
            <div
              className="FundHeader"
              style={{
                boxShadow:
                  "0 3px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="contentHeader">
                <div style={titleStyle}>{this.state.name}</div>
                <div
                  ref={el => {
                    this.contentHeader = el;
                  }}
                  style={{
                    transition: "all 0.3s ease-in-out",
                    overflowY: "hidden"
                  }}
                >
                  <SubTitle fund={this.state} />
                  <FundDetailHeader
                    fund={
                      new Fund({
                        amountWagered: this.state.isTraining
                          ? parseInt(
                              this.state.fundCap.replace(/,/gi, ""),
                              10
                            ) * 100
                          : 0,
                        maxBalance:
                          parseInt(this.state.fundCap.replace(/,/gi, ""), 10) *
                          100,
                        status: this.state.openImmediately ? "OPEN" : "STAGED",
                        isTraining: this.state.isTraining
                      })
                    }
                    userWager={0}
                    userCurrent={0}
                    isManager
                  />
                </div>
              </div>
            </div>

            <div
              style={{ height: window.innerHeight - 128, overflowY: "scroll" }}
            >
              <div className="tabContent">
                {this.state.selectedGames.length > 0 ? (
                  <div>
                    <div
                      className="potentialGamesCopy"
                      style={{ color: textColor2 }}
                    >
                      THIS POOL WILL BET ON THE FOLLOWING GAME:
                    </div>
                    <PotentialGames selectedGames={this.state.selectedGames} />
                  </div>
                ) : null}

                <div style={{ margin: "32px 0" }}>
                  <Editor
                    content={this.state.summary}
                    initialValue={this.state.summary}
                    init={{
                      plugins: [
                        "advlist autolink lists link image charmap preview hr anchor pagebreak",
                        "searchreplace wordcount visualblocks visualchars code",
                        "insertdatetime media nonbreaking table contextmenu directionality",
                        "emoticons template paste textcolor colorpicker textpattern imagetools codesample"
                      ],
                      toolbar:
                        "codesample | bold italic underline | sizeselect fontselect fontsizeselect | hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | insertfile undo redo | forecolor backcolor emoticons | code",
                      height: 500,
                      images_upload_handler: (blobInfo, success) => {
                        UploadSummaryImage({
                          fileName: blobInfo.filename(),
                          blob: blobInfo.blob()
                        })
                          .then(snapshot => snapshot.ref.getDownloadURL())
                          .then(url => success(url));
                      }
                    }}
                    onChange={this.handleEditorChange}
                  />
                </div>
                <RaisedButton
                  label="Back"
                  style={{ marginRight: 10 }}
                  labelStyle={{ color: themeColor }}
                  onClick={() => {
                    this.setState({
                      creationStep: "game",
                      inputField: "Potential Games"
                    });
                  }}
                />
                <RaisedButton
                  primary
                  style={{ marginLeft: 10 }}
                  label="Create Pool"
                  onClick={this.createFund}
                  disabled={this.state.fundCreated}
                />
                <div
                  style={{
                    marginTop: 16,
                    color: alertColor
                  }}
                >
                  {this.state.summaryError}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    display: this.state.fundCreated ? "block" : "none",
                    color: themeColor
                  }}
                >
                  Pool Created
                </div>
                <div style={{ height: 50 }} />
              </div>
            </div>
          </div>
        </IntlProvider>
      </V0MuiThemeProvider>
    );
  };

  render() {
    if (this.state.fundId && this.state.name === undefined) {
      return (
        <MuiThemeProvider theme={mgAppTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    const paperStyle = {
      backgroundColor: "#fff",
      overflowY: "scroll",
      height: "100vh",
      padding: "24px 0",
      boxSizing: "border-box"
    };

    const contentStyle = {
      margin: "0 auto 24px"
    };

    const errorStyle = {
      textAlign: "left",
      color: alertColor,
      top: -5
    };

    const logoStyle = {
      height: 40,
      margin: "auto",
      marginTop: "32px",
      marginBottom: "32px"
    };

    const rootStyle = {
      width: "100%"
    };

    const style = {
      textAlign: "left",
      height: 48,
      marginTop: 0,
      width: "100%"
    };

    const iconStyle = {
      top: 20
    };

    const labelStyle = {
      height: 48,
      marginTop: 12
    };

    const stepStyles = {
      labelStyle,
      iconStyle,
      style,
      rootStyle,
      logoStyle,
      errorStyle,
      contentStyle,
      paperStyle
    };

    const renderCreationStep = () => {
      switch (this.state.creationStep) {
        case "name":
          return this.renderNameStep(stepStyles);
        case "date":
          return this.renderDateStep(stepStyles);
        case "game":
          return this.renderGameStep(stepStyles);
        case "summary":
          return this.renderSummaryStep();
        default:
          return this.renderNameStep(stepStyles);
      }
    };

    return (
      <div>
        {renderCreationStep()}
        {this.props.size > 624 && 
          <TooltipDrawer
            field={this.state.inputField}
            isTraining={this.props.user.manager.isTraining}
            fundName={this.state.name}
          />}
      </div>
    );
  }
}
