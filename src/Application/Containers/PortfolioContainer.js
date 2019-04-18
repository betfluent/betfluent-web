import { connect } from "react-redux";
import Portfolio from "../Components/Portfolio/Portfolio";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  approved: state.location.approved
});

const PortfolioContainer = connect(mapStateToProps)(Portfolio);

export default PortfolioContainer;
