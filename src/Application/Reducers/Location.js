export const location = (
  state = { approved: undefined, location: undefined },
  action
) => {
  switch (action.type) {
    case "RECEIVE_LOCATION":
      return {
        approved: state.approved,
        location: action.location,
        granted: state.granted,
        openConsole: state.openConsole
      };
    case "RECEIVE_APPROVAL":
      return {
        approved: action.approved,
        location: state.location,
        granted: state.granted,
        openConsole: state.openConsole
      };
    case "LOCATION_GRANTED":
      return {
        approved: state.approved,
        location: state.location,
        granted: action.granted,
        openConsole: state.openConsole
      };
    case "CONSOLE_OPENED":
      return {
        approved: state.approved,
        location: state.location,
        granted: state.granted,
        openConsole: action.openConsole
      };
    default:
      return {
        approved: state.approved,
        location: state.location,
        granted: state.granted,
        openConsole: state.openConsole
      };
  }
};

export default location;
