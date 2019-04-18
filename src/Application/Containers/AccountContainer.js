import { connect } from "react-redux";
import Account from "../Components/Account/Account";

const mapStateToProps = state => ({ user: state.user.user });

const AccountContainer = connect(mapStateToProps)(Account);

export default AccountContainer;
