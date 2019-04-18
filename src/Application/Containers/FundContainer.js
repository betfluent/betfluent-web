import { connect } from "react-redux";
import Fund from "../Components/Fund/Fund";

const mapStateToProps = state => ({
  user: state.user.user,
  location: state.location.location
});

const FundContainer = connect(mapStateToProps)(Fund);

export default FundContainer;
