export const authUser = (state = { authUser: undefined }, action) => {
  switch (action.type) {
    case "RECEIVE_AUTH_USER":
      return {
        authUser: action.authUser
      };
    default:
      return {
        authUser: state.authUser
      };
  }
};

export default authUser;
