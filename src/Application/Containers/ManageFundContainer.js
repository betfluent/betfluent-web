import { connect } from "react-redux";
import ManageFund from "../Components/Manage/Fund";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager,
  location: state.location.location
});

const ManageFundContainer = connect(mapStateToProps)(ManageFund);

export default ManageFundContainer;
