import { connect } from "react-redux";
import PinScreen from "../Components/PinScreen";

const mapStateToProps = state => ({
  user: state.user.user,
  authUser: state.authUser.authUser
});

const PinScreenContainer = connect(mapStateToProps)(PinScreen);

export default PinScreenContainer;
