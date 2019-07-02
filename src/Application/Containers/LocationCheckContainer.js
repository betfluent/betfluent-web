import { connect } from "react-redux";
import { allowLocation, tryAgain } from "../Actions";
import LocationCheck from "../Components/LocationCheck";

const mapStateToProps = state => ({
  authUser: state.authUser.authUser,
  location: state.location.location,
  granted: state.location.granted
});

const mapDispatchToProps = dispatch => ({
  allowLocation: () => {
    dispatch(allowLocation());
  },
  tryAgain: () => {
    dispatch(tryAgain());
  }
});

const LocationCheckContainer = connect(mapStateToProps, mapDispatchToProps)(
  LocationCheck
);

export default LocationCheckContainer;
