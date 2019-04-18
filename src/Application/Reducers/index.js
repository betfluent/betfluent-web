import { combineReducers } from "redux";
import user from "./User";
import location from "./Location";
import authUser from "./AuthUser";

const appReducer = combineReducers({
  authUser,
  user,
  location
});

export default appReducer;
