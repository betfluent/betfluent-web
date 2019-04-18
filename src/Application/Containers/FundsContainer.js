import { connect } from "react-redux";
import Funds from "../Components/Lobby/Funds";

const mapStateToProps = state => ({ user: state.user.user });

const FundsContainer = connect(mapStateToProps)(Funds);

export default FundsContainer;
