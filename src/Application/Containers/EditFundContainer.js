import { connect } from "react-redux";
import EditFund from "../Components/Manage/EditFund";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const EditFundContainer = connect(mapStateToProps)(EditFund);

export default EditFundContainer;
