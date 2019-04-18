import { connect } from "react-redux";
import Learn from "../Components/Learn/Learn";

const mapStateToProps = state => ({ user: state.user.user });

const LearnContainer = connect(mapStateToProps)(Learn);

export default LearnContainer;
