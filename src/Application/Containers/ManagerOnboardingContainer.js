import { connect } from "react-redux";
import ManagerOnboarding from "../Components/Manage/ManagerOnboarding";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const ManagerOnboardingContainer = connect(mapStateToProps)(ManagerOnboarding);

export default ManagerOnboardingContainer;
