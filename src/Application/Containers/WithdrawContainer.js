import { connect } from "react-redux";
import { authenticateUser } from "../Actions";
import Withdraw from "../Components/Withdraw/Withdraw";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  location: state.location.location,
  authUser: state.authUser.authUser,
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  authenticateUser: isAuthenticated => {
    dispatch(authenticateUser(isAuthenticated));
  }
});

const WithdrawContainer = connect(mapStateToProps, mapDispatchToProps)(
  Withdraw
);

export default WithdrawContainer;
