import { connect } from "react-redux";
import Performance from "../Components/Profile/ManagerProfile";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  isManager: state.user.isManager,
  manager: state.user.user.manager
});

const PerformanceContainer = connect(mapStateToProps)(Performance);

export default PerformanceContainer;
