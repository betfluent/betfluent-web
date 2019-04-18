import { connect } from "react-redux";
import Recents from "../Components/Recents/Recents";

const mapStateToProps = state => ({
  user: state.user.user,
  isManager: state.user.isManager
});

const RecentsContainer = connect(mapStateToProps)(Recents);

export default RecentsContainer;
