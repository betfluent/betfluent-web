import { connect } from "react-redux";
import BtbLandingPage from "../Components/BTB/BtbLandingPage";

const mapStateToProps = state => ({ user: state.user.user });

const BtbLandingPageContainer = connect(mapStateToProps)(BtbLandingPage);

export default BtbLandingPageContainer;
