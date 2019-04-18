import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MobileTopHeader from "../Components/MobileTopHeader";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const MobileTopHeaderContainer = withRouter(
  connect(mapStateToProps)(MobileTopHeader)
);

export default MobileTopHeaderContainer;
