export const user = (state = { user: undefined }, action) => {
  switch (action.type) {
    case "RECEIVE_USER":
      return {
        user: action.user,
        isManager: state.isManager,
        isAuthenticated: state.isAuthenticated
      };
    case "SET_MANAGER":
      return {
        user: state.user,
        isManager: action.isManager,
        isAuthenticated: state.isAuthenticated
      };
    case "AUTHENTICATE_USER":
      return {
        user: state.user,
        isManager: state.isManager,
        isAuthenticated: action.isAuthenticated
      };
    default:
      return {
        user: state.user,
        isManager: state.isManager,
        isAuthenticated: state.isAuthenticated
      };
  }
};

export default user;
