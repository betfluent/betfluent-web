import { connect } from "react-redux";
import Header from "../Components/Header";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  isManager: state.user.isManager
});

const HeaderContainer = connect(mapStateToProps)(Header);

export default HeaderContainer;
