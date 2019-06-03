// @flow
/* eslint-disable */

import React, { Component } from "react";
import { Redirect } from "react-router";
import { withRouter, Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import debounce from "lodash/debounce";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../Styles/App.css";
import NotFound from "./NotFound";
import Login from "./Login";
import VerifyBarContainer from "../Containers/VerifyBarContainer";
import HeaderContainer from "../Containers/HeaderContainer";
import FundsContainer from "../Containers/FundsContainer";
import FundContainer from "../Containers/FundContainer";
import PortfolioContainer from "../Containers/PortfolioContainer";
import Register from "./Registration/Register";
import ForgotPassword from "./ForgotPassword";
import RecentsContainer from "../Containers/RecentsContainer";
import ProfileContainer from "../Containers/ProfileContainer";
import LearnContainer from "../Containers/LearnContainer";
import ManagerContainer from "../Containers/ManagerContainer";
import ManagerOnboardingContainer from "../Containers/ManagerOnboardingContainer";
import PerformanceContainer from "../Containers/PerformanceContainer";
import IdleLock from "../Extensions/IdleLock";
import PinScreenContainer from "../Containers/PinScreenContainer";
import AccountContainer from "../Containers/AccountContainer";
import VerifyEmail from "./Verify/VerifyEmail";
import GameDetailContainer from "../Containers/GameDetailContainer";
import TourDialog from "./TourDialog";
import Deposit from './Deposit';
import WithdrawContainer from '../Containers/WithdrawContainer';
import TermsOfUse from "./Registration/Terms";
import PrivacyPolicy from "./Registration/Privacy";
import FAQ from "./FAQ";
import { scrollComponent } from "./Shared/Scroll";
import { appTheme, desktopBreakPoint, mobileBreakPoint } from "./Styles";

const ScrollFund = scrollComponent(FundContainer);

const Loading = () => (
  <MuiThemeProvider theme={appTheme}>
    <div className="fill-window center-flex">
      <CircularProgress />
    </div>
  </MuiThemeProvider>
);

const VerifyIdentityLoader = Loadable({
  loader: () => import("../Containers/VerifyIdentityContainer"),
  loading: Loading
});

const VerifyDocumentLoader = Loadable({
  loader: () => import("../Containers/VerifyDocumentContainer"),
  loading: Loading
});

const ManageFund = Loadable({
  loader: () => import("../Containers/ManageFundContainer"),
  loading: Loading
});
const CreateFund = Loadable({
  loader: () => import("../Containers/CreateFundContainer"),
  loading: Loading
});
const EditFund = Loadable({
  loader: () => import("../Containers/EditFundContainer"),
  loading: Loading
});
const PlaceBet = Loadable({
  loader: () => import("../Containers/PlaceBetContainer"),
  loading: Loading
});
const ManageGameDetail = Loadable({
  loader: () => import("../Containers/ManageGameDetailContainer"),
  loading: Loading
});

type routeProps = {
  authUser: {},
  isManager: boolean,
  size: number,
  component: {},
  // eslint-disable-next-line react/require-default-props
  location?: {
    state?: {
      referrer?: {}
    }
  }
};

const NotFoundPage = (props: routeProps) => (
  <NotFound {...props} size={props.size} />
);

const LoginPage = (props: routeProps) => {
  if (!props.authUser || props.authUser === null) {
    return <Login {...props} size={props.size} />;
  }
  if (props.location && props.location.state && props.location.state.referrer) {
    const referrer = props.location.state.referrer;
    if (referrer.pathname.includes("verify-email")) {
      return <Redirect to={props.location.state.referrer} />;
    }
  }
  return <Redirect to="/" />;
};

const ForgotPasswordPage = (props: routeProps) => {
  if (!props.authUser || props.authUser === null) {
    return <ForgotPassword {...props} size={props.size} />;
  }
  return <Redirect to="/" />;
};

const RegistrationPage = (props: routeProps) => {
  if (!props.authUser || props.authUser === null) {
    return <Register {...props} size={props.size} />;
  }
  return <Redirect to="/" />;
};

const ManagerRoute = ({ component: PrivateComponent, ...rest }: routeProps) => {
  const { authUser, isManager, size } = rest;
  return authUser && isManager ? (
    <PrivateComponent {...rest} size={size} />
  ) : (
    <Redirect
      to={{
        pathname: "/",
        state: { referrer: rest.location }
      }}
    />
  );
};

const PrivateRoute = ({ component: PrivateComponent, ...rest }: routeProps) => {
  const { authUser, size, isManager } = rest;
  return authUser ? (
    <PrivateComponent {...rest} size={size} isManager={isManager} />
  ) : (
    <Redirect
      to={{
        pathname: "/",
        state: { referrer: rest.location }
      }}
    />
  );
};

const FundRouter = withRouter(ScrollFund);
const RegistrationRouter = withRouter(RegistrationPage);
const HeaderRouter = withRouter(HeaderContainer);
const GameDetailRouter = withRouter(GameDetailContainer);
const ManageFundRouter = withRouter(ManageFund);
const EditFundRouter = withRouter(EditFund);
const CreateFundRouter = withRouter(CreateFund);
const BetRouter = withRouter(PlaceBet);
const ManageGameDetailRouter = withRouter(ManageGameDetail);
const ManagerRouter = withRouter(ManagerContainer);
const ProfileRouter = withRouter(ProfileContainer);
const VerifyIdentityRouter = withRouter(VerifyIdentityLoader);
const VerifyDocumentRouter = withRouter(VerifyDocumentLoader);
const VerifyEmailRouter = withRouter(VerifyEmail);
const DepositRoute = withRouter(Deposit);
const WithdrawRoute = withRouter(WithdrawContainer);

if (Number.parseInt === undefined) Number.parseInt = window.parseInt;

type AppProps = {
  fetchUser: () => void,
  location: {
    pathname: string
  },
  authUser: {
    metadata: {
      creationTime: string,
      lastSignInTime: number
    }
  },
  isManager: boolean,
  granted: boolean,
  user: User
};

class App extends Component<AppProps> {
  constructor() {
    super();
    this.setLock = this.setLock.bind(this);
    this.windowResize = this.windowResize.bind(this);
    this.seenTour = this.seenTour.bind(this);
    this.finishOnboarding = this.finishOnboarding.bind(this);
    const lock =
      (Number.parseInt(window.sessionStorage.getItem("lock"), 10) || 0) -
        new Date().getTime() <
      0;
    const showTour = false;
    this.state = {
      size: window.innerWidth,
      lock,
      showTour,
      showOnboarding: false
    };
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  componentDidMount() {
    window.addEventListener("resize", this.windowResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authUser === null) {
      const lock = true;
      window.sessionStorage.setItem("lock", 0);
      this.setState({ lock });
    } else {
      if (
        !this.state.seenTour &&
        this.props.authUser === null &&
        nextProps.authUser &&
        nextProps.authUser.metadata.lastSignInTime ===
          nextProps.authUser.metadata.creationTime
      ) {
        const showTour = true;
        this.setState({ showTour });
      }

      if (nextProps.isManager && nextProps.user) {
        if (nextProps.user.manager.details) {
          this.setState({ showOnboarding: false });
        } else {
          this.setState({ showOnboarding: true });
        }
      }
    }
  }

  setLock(lock) {
    this.setState({ lock });
  }

  seenTour() {
    const showTour = false;
    const seenTour = true;
    this.setState({ showTour, seenTour });
  }

  finishOnboarding() {
    this.setState({ showOnboarding: false });
  }

  componentWillUnMount() {
    window.removeEventListener("resize", this.windowResize);
  }

  windowResize = debounce(() => {
    if (this.state.size !== window.innerWidth) {
      this.setState({
        size: window.innerWidth
      });
    }
  }, 200);

  render() {
    const paneSize = () => {
      const { pathname } = this.props.location;
      if (this.state.size > desktopBreakPoint) {
        return { marginLeft: 240, minHeight: "100%" };
      }
      if (this.state.size < mobileBreakPoint) {
        return { marginBottom: 56, minHeight: "100%" };
      }
      return { marginLeft: 184, minHeight: "100%" };
    };

    const renderRoutes = ({ idle }) => {
      if (
        (this.props.location.pathname !== '/account/verify-email') &&
        (
          (idle && this.props.authUser) ||
          (this.state.lock && this.props.authUser)
        )
      ) {
        return <PinScreenContainer setLock={this.setLock} />;
      }
      return (
        <div className="App">
          <HeaderRouter
            setLock={this.setLock}
            size={this.state.size}
            authUser={this.props.authUser}
          />
          <div style={paneSize()}>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <FundsContainer
                    authUser={this.props.authUser}
                    size={this.state.size}
                    isManager={this.props.isManager}
                  />
                )}
              />
              <Route
                exact
                path="/pools/:fund"
                render={() => (
                  <FundRouter
                    authUser={this.props.authUser}
                    size={this.state.size}
                    isManager={this.props.isManager}
                  />
                )}
              />
              <Route
                path="/pools/:fund/:game"
                render={() => (
                  <GameDetailRouter
                    authUser={this.props.authUser}
                    size={this.state.size}
                    isManager={this.props.isManager}
                  />
                )}
              />
              <Route
                exact
                path="/managers/:managerId"
                render={() => (
                  <ProfileRouter 
                    authUser={this.props.authUser}
                    size={this.state.size}
                    isManager={this.props.isManager}
                  />
                )}
              />
              <Route
                path="/learn"
                render={() => (
                  <LearnContainer
                    authUser={this.props.authUser}
                    size={this.state.size}
                    isManager={this.props.isManager}
                  />
                )}
              />
              <Route
                path="/login"
                render={() => (
                  <LoginPage
                    authUser={this.props.authUser}
                    size={this.state.size}
                    location={this.props.location}
                  />
                )}
              />
              <Route
                path="/register"
                render={() => (
                  <RegistrationRouter
                    authUser={this.props.authUser}
                    size={this.state.size}
                  />
                )}
              />
              <Route
                path="/forgotpassword"
                render={() => (
                  <ForgotPasswordPage
                    authUser={this.props.authUser}
                    size={this.state.size}
                  />
                )}
              />
              <Route path="/termsofuse" component={TermsOfUse} />
              <Route path="/privacypolicy" component={PrivacyPolicy} />
              <Route path="/faq" component={FAQ} />
              <PrivateRoute
                path="/portfolio"
                component={PortfolioContainer}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                path="/recent"
                component={RecentsContainer}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                exact
                path="/manage"
                component={ManagerRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/performance"
                component={PerformanceContainer}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/pools/create"
                component={CreateFundRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/pools/:fund"
                component={ManageFundRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/pools/:fund/edit"
                component={EditFundRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/pools/:fund/bet"
                component={BetRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <ManagerRoute
                exact
                path="/manage/pools/:fund/:game"
                component={ManageGameDetailRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                exact
                path="/account"
                component={AccountContainer}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                exact
                path="/account/deposit"
                component={DepositRoute}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                exact
                path="/account/withdraw"
                component={WithdrawRoute}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                path="/account/verify-identity"
                component={VerifyIdentityRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <PrivateRoute
                path="/account/verify-document"
                component={VerifyDocumentRouter}
                authUser={this.props.authUser}
                size={this.state.size}
                isManager={this.props.isManager}
              />
              <Route
                path="/account/verify-email"
                render={() => 
                  <VerifyEmailRouter
                    size={this.state.size}
                    authUser={this.state.authUser}
                  />
                }
              />
              <Route
                path="*"
                render={() => <NotFoundPage size={this.state.size} />}
              />
            </Switch>
          </div>
          <TourDialog seenTour={this.seenTour} open={this.state.showTour} />
          {this.props.isManager && (
            <ManagerOnboardingContainer
              finishOnboarding={this.finishOnboarding}
              setLock={this.setLock}
              showOnboarding={this.state.showOnboarding}
            />
          )}
          <VerifyBarContainer
            authUser={this.props.authUser}
            size={this.state.size}
          />
        </div>
      );
    };

    if (
      this.props.authUser === undefined ||
      this.props.user === undefined ||
      this.props.isManager === undefined
    ) {
      return <Loading />;
    }
    return (
      <IdleLock
        timeout={1000 * 60 * 15}
        lock={this.state.lock}
        render={renderRoutes}
      />
    );
  }
}

export default App;
