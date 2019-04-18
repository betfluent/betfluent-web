import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUser } from "../Actions";
import App from "../Components/App";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  authUser: state.authUser.authUser,
  isManager: state.user.isManager,
  granted: state.location.granted,
  user: state.user.user
});

const mapDispatchToProps = dispatch => ({
  fetchUser: () => {
    dispatch(fetchUser());
  }
});

const AppContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
);

export default AppContainer;
