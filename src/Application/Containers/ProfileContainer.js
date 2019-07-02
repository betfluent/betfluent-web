import { connect } from "react-redux";
import Profile from "../Components/Profile/Profile";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const ProfileContainer = connect(mapStateToProps)(Profile);

export default ProfileContainer;
