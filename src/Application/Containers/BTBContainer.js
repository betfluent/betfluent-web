import { connect } from "react-redux";
import BTB from "../Components/BTB/BTB";

const mapStateToProps = state => ({ user: state.user.user });

const BTBContainer = connect(mapStateToProps)(BTB);

export default BTBContainer;
