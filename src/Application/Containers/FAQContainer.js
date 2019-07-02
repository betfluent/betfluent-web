import { connect } from "react-redux";
import FAQ from "../Components/FAQ";

const mapStateToProps = state => ({ authUser: state.authUser.authUser });

const FAQContainer = connect(mapStateToProps)(FAQ);

export default FAQContainer;
