import { connect } from "react-redux";
import GameDetail from "../Components/Fund/GameDetail/GameDetail";

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user.user,
  location: state.location.location
});

const GameDetailContainer = connect(mapStateToProps)(GameDetail);

export default GameDetailContainer;
