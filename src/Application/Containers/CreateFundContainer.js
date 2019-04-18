import { connect } from "react-redux";
import CreateFund from "../Components/Manage/CreateFund";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const CreateFundContainer = connect(mapStateToProps)(CreateFund);

export default CreateFundContainer;
