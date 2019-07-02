import { connect } from "react-redux";
import Manage from "../Components/Manage/Manager";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const ManagerContainer = connect(mapStateToProps)(Manage);

export default ManagerContainer;
