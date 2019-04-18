// @flow

import React, { Component } from "react";
import ReactGA from "react-ga";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import ErrorOutline from "material-ui/svg-icons/alert/error-outline";
import {
  GetOnFidoTokenService,
  CompleteOnFidoService
} from "../../Services/BackendService";
import Onfido from "../../Extensions/OnfidoExt";
import MobileTopHeaderContainer from "../../Containers/MobileTopHeaderContainer";
import { appTheme, gMuiTheme } from "../Styles";
import { getNewUid } from "../../Services/DbService";
import VerifyDialog from "./VerifyDialog";
import ReauthenticateModal from "../Shared/ReauthenticateModal";
import CloseConsoleModal from "../Shared/CloseConsoleModal";
import CheckingLocationModal from "../Shared/CheckingLocationModal";
import RestrictedLocationModal from "../Shared/RestrictedLocationModal";
import * as photoID from "../../../Assets/photoid.json";

const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type VerifyProps = {
  user: User,
  authUser: {
    email: string
  },
  history: {
    replace: () => void
  },
  location: {},
  size: number,
  approved: boolean,
  openConsole: boolean,
  authenticateUser: () => void,
  isAuthenticated: boolean
};

export default class Verify extends Component<VerifyProps> {
  constructor() {
    super();
    this.goBackToFund = this.goBackToFund.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      user: null,
      error: {},
      onFidoLoading: false,
      onFidoSuccess: false,
      onFidoPending: false,
      onFidoDialogOpen: false
    };
  }

  componentWillMount() {
    if (
      this.props.user &&
      this.props.user.identityVerified &&
      !this.state.onFidoToken
    ) {
      this.getOnFidoToken();
    }
  }

  componentDidMount() {
    if (
      this.props.user &&
      (this.props.user.documentStatus === "VERIFIED" ||
        this.props.user.documentStatus === "PENDING")
    ) {
      this.props.history.replace("/lobby");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user &&
      nextProps.user.identityVerified &&
      !this.state.onFidoToken
    ) {
      this.getOnFidoToken();
    }

    if (
      nextProps.user &&
      this.props.user &&
      nextProps.user.documentStatus &&
      nextProps.user.documentStatus !== this.props.user.documentStatus
    ) {
      let onFidoDialogOpen = false;
      let onFidoSuccess = false;
      let onFidoLoading = false;
      let onFidoPending = false;

      if (nextProps.user.documentStatus === "FAIL") {
        onFidoDialogOpen = true;
        onFidoSuccess = false;
        onFidoLoading = false;
        onFidoPending = false;
        this.setState({
          onFidoDialogOpen,
          onFidoSuccess,
          onFidoLoading,
          onFidoPending
        });
      }

      if (nextProps.user.documentStatus === "PENDING") {
        onFidoDialogOpen = true;
        onFidoSuccess = true;
        onFidoLoading = false;
        onFidoPending = true;
        this.setState({
          onFidoDialogOpen,
          onFidoSuccess,
          onFidoLoading,
          onFidoPending
        });
      }

      if (nextProps.user.documentStatus === "RETRY") {
        onFidoDialogOpen = true;
        onFidoSuccess = false;
        onFidoLoading = true;
        onFidoPending = true;
        this.setState({
          onFidoDialogOpen,
          onFidoSuccess,
          onFidoLoading,
          onFidoPending
        });
      }

      if (nextProps.user.documentStatus === "VERIFIED") {
        onFidoDialogOpen = true;
        onFidoSuccess = true;
        onFidoLoading = false;
        onFidoPending = false;
        this.setState({
          onFidoDialogOpen,
          onFidoSuccess,
          onFidoLoading,
          onFidoPending
        });
      }
    }
  }

  componentDidUpdate() {
    if (this.state.onFidoToken && this.onfido && !this.initOnFido)
      this.onFidoInit();
  }

  componentWillUnmount() {
    if (this.onFidoObject) this.onFidoObject.tearDown();
  }

  onFidoInit = () => {
    this.initOnFido = true;
    this.onFidoObject = Onfido.init({
      token: this.state.onFidoToken,
      containerId: "onfido-mount",
      steps: [
        {
          type: "welcome",
          options: {
            title: "Upload your photo identification",
            descriptions: ["We need a photo id to verify your identity"]
          }
        },
        "document"
      ],
      onComplete: () => {
        let onFidoDialogOpen = true;
        let onFidoSuccess = false;
        let onFidoLoading = true;
        let onFidoPending = false;
        this.setState({
          onFidoDialogOpen,
          onFidoSuccess,
          onFidoLoading,
          onFidoPending
        });
        const payLoad = {
          dateCreated: new Date().getTime(),
          id: getNewUid(),
          request: {},
          serviceType: "DOCUMENT",
          deviceLocation: this.props.location
        };
        CompleteOnFidoService(payLoad).then(results => {
          if (results.status === "error") {
            onFidoDialogOpen = true;
            onFidoSuccess = false;
            onFidoLoading = false;
            onFidoPending = false;
            this.setState({
              onFidoDialogOpen,
              onFidoSuccess,
              onFidoLoading,
              onFidoPending
            });
          }
        });
      }
    });
  };

  getOnFidoToken = () => {
    GetOnFidoTokenService()
      .then(onFidoToken => {
        const tokenError = null;
        this.setState({ onFidoToken, tokenError });
      })
      .catch(() => {
        const tokenError =
          "An error occured with our service. Please refresh the page and try again.";
        this.setState({ tokenError });
      });
  };

  goBackToFund() {
    const fundId = window.location.hash.replace("#", "");
    if (fundId) {
      this.props.history.replace(`/pools/${fundId}#wager`);
    }
  }

  handleClose() {
    this.props.history.replace("/lobby");
  }

  closeOnFidoDialog = () => {
    this.setState({ onFidoDialogOpen: false });
  };

  render() {
    if (!this.props.user)
      return (
        <MuiThemeProvider theme={appTheme}>
          <div className="fill-window center-flex">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );

    if (!this.props.isAuthenticated) {
      return (
        <ReauthenticateModal
          size={this.props.size}
          open
          authUser={this.props.authUser}
          authenticateUser={this.props.authenticateUser}
        />
      );
    }

    if (this.props.openConsole) {
      return (
        <CloseConsoleModal
          size={this.props.size}
          open={this.props.openConsole}
        />
      );
    }

    if (
      !this.props.location ||
      this.props.approved === null ||
      this.props.approved === undefined
    ) {
      const startCheckingTime = new Date();
      this.startCheckingTime = startCheckingTime.getTime();
      ReactGA.modalview("locationModal");
      return <CheckingLocationModal size={this.props.size} open />;
    }

    if (
      this.props.location &&
      this.props.approved &&
      this.startCheckingTime !== null
    ) {
      const endCheckingTime = new Date();
      const checkingTime = endCheckingTime.getTime() - this.startCheckingTime;
      this.startCheckingTime = null;
      ReactGA.timing({
        category: "Checking Location",
        variable: "checking location",
        value: checkingTime,
        label: "Location Modal"
      });
    }

    if (this.props.approved === false) {
      const startRestrictedTime = new Date();
      this.startRestrictedTime = startRestrictedTime.getTime();
      ReactGA.modalview("restrictedLocationModal");
      return (
        <RestrictedLocationModal
          size={this.props.size}
          open
          handleClose={this.handleClose}
          behavior="verify"
        />
      );
    }

    if (this.props.approved && this.startRestrictedTime !== null) {
      const endRestrictedTime = new Date();
      const restrictedTime =
        endRestrictedTime.getTime() - this.startRestrictedTime;
      this.startRestrictedTime = null;
      ReactGA.timing({
        category: "Restricted Location",
        variable: "restricted location",
        value: restrictedTime,
        label: "Restricted Location Modal"
      });
    }

    if (this.state.tokenError) {
      return (
        <V0MuiThemeProvider muiTheme={gMuiTheme}>
          <div
            style={{
              color: textColor3,
              width: 300,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform:
                this.props.size < mobileBreakPoint
                  ? "translate(-50%, -50%)"
                  : "translateY(-50%)",
              fontSize: 18
            }}
          >
            <ErrorOutline
              style={{
                height: 100,
                width: 100,
                display: "block",
                margin: "0 auto"
              }}
              color={textColor3}
            />
            {this.state.tokenError}
          </div>
        </V0MuiThemeProvider>
      );
    }

    return (
      <V0MuiThemeProvider muiTheme={gMuiTheme}>
        <div>
          {this.props.size < mobileBreakPoint ? (
            <MobileTopHeaderContainer />
          ) : null}
          <div
            ref={el => {
              this.onfido = el;
            }}
            id="onfido-mount"
          />
          <VerifyDialog
            verifyDialogOpen={this.state.onFidoDialogOpen}
            handleClose={this.closeOnFidoDialog}
            goBackToFund={() => {
              this.closeOnFidoDialog();
              this.goBackToFund();
            }}
            gotoLobby={() => {
              this.props.history.replace("/lobby");
            }}
            onFidoCheck
            loading={this.state.onFidoLoading}
            loadingTitle="Verifying your Photo ID"
            loadingMsg="This may take a few moments."
            loadinglottieFile={photoID}
            pending={this.state.onFidoPending}
            pendingTitle="Verifying your Photo ID"
            pendingMsg="The process has started. Meanwhile you can wager on pools."
            pendinglottieFile={photoID}
            success={this.state.onFidoSuccess}
            failMsg="We have been unable to verify your photo identification. Please try again."
          />
        </div>
      </V0MuiThemeProvider>
    );
  }
}
