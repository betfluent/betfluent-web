import { connect } from "react-redux";
import PlaceBet from "../Components/Manage/PlaceBet";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager,
  location: state.location.location
});

const PlaceBetContainer = connect(mapStateToProps)(PlaceBet);

export default PlaceBetContainer;
