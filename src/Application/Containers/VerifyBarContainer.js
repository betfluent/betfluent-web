import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import VerifyBar from "../Components/Verify/VerifyBar";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  approved: state.location.approved,
  location: state.location.location
});

const VerifyBarContainer = withRouter(connect(mapStateToProps)(VerifyBar));

export default VerifyBarContainer;
