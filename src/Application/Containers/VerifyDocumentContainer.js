import { connect } from "react-redux";
import { authenticateUser, startConsoleWatch } from "../Actions";
import VerifyDocument from "../Components/Verify/VerifyDocument";

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

const VerifyDocumentContainer = connect(mapStateToProps, mapDispatchToProps)(
  VerifyDocument
);

export default VerifyDocumentContainer;
