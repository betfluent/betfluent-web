import { connect } from "react-redux";
import { authenticateUser, startConsoleWatch } from "../Actions";
import VerifyIdentity from "../Components/Verify/VerifyIdentity";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  authUser: state.authUser.authUser,
  user: state.user.user,
  approved: state.location.approved,
  location: state.location.location,
  openConsole: state.location.openConsole,
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  authenticateUser: isAuthenticated => {
    dispatch(authenticateUser(isAuthenticated));
  },
  toggleConsoleWatch: isEnabled => {
    dispatch(startConsoleWatch(isEnabled));
  }
});

const VerifyIdentityContainer = connect(mapStateToProps, mapDispatchToProps)(
  VerifyIdentity
);

export default VerifyIdentityContainer;
