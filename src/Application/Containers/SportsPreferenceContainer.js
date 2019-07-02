import { connect } from "react-redux";
import SportsPreference from "../Components/SportsPreference";

const mapStateToProps = state => ({ user: state.user.user });

const SportsPreferenceContainer = connect(mapStateToProps)(SportsPreference);

export default SportsPreferenceContainer;
