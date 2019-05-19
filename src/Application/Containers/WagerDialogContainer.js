import { connect } from "react-redux";
import { withRouter } from "react-router";
import { authenticateUser } from "../Actions";
import WagerDialog from "../Components/Fund/WagerDialog";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  authUser: state.authUser.authUser,
  approved: state.location.approved,
  location: state.location.location,
  openConsole: state.location.openConsole,
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  authenticateUser: isAuthenticated => {
    dispatch(authenticateUser(isAuthenticated));
  }
});

const WagerDialogContainer = connect(mapStateToProps, mapDispatchToProps)(
  WagerDialog
);

export default withRouter(WagerDialogContainer);
