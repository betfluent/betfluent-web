import { connect } from "react-redux";
import ManageGameDetail from "../Components/Manage/GameDetail/GameDetail";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager,
  location: state.location.location
});

const ManageGameDetailContainer = connect(mapStateToProps)(ManageGameDetail);

export default ManageGameDetailContainer;
