import moment from "moment";
import { onAuthUserChanged } from "../Services/AuthService";
import { LocationService } from "../Services/BackendService";
import { getNewUid, getUserFeed } from "../Services/DbService";

const b64DecodeUnicode = str =>
  decodeURIComponent(
    Array.prototype.map
      .call(atob(str), c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

let gpsInterval = 0;
let authInterval = 0;
// let consoleWatch;
let locationPromise;

export const receiveAuthUser = authUser => ({
  type: "RECEIVE_AUTH_USER",
  authUser
});

export const receiveUser = user => ({
  type: "RECEIVE_USER",
  user
});

export const setManager = isManager => ({
  type: "SET_MANAGER",
  isManager
});

export const locationGranted = granted => ({
  type: "LOCATION_GRANTED",
  granted
});

export const setLocation = (location, openConsole) => ({
  type: "RECEIVE_LOCATION",
  location,
  openConsole
});

export const setApproval = approved => ({
  type: "RECEIVE_APPROVAL",
  approved
});

export const consoleIsOpened = openConsole => ({
  type: "CONSOLE_OPENED",
  openConsole
});

export const authenticateUser = isAuthenticated => ({
  type: "AUTHENTICATE_USER",
  isAuthenticated
});

export const fetchLocation = user => dispatch => {
  dispatch(locationGranted(true));
  dispatch(setLocation(true));
  dispatch(setApproval(true));
};

export const startConsoleWatch = () => dispatch => {
  // if (enabled) {
  //   consoleWatch = window.jdetects.create({
  //     onchange: status => {
  //       dispatch(consoleIsOpened(status));
  //       if (status) {
  //         dispatch(setLocation(null));
  //         window.localStorage.removeItem("userLocation");
  //       } else {
  //         dispatch(fetchLocation(true));
  //       }
  //     }
  //   });
  // } else if (consoleWatch && consoleWatch.free) consoleWatch.free();
  dispatch(consoleIsOpened(false));
};

export const allowLocation = () => dispatch => {
  window.localStorage.setItem("locationGranted", 1);
  dispatch(fetchLocation(true));
};

export const tryAgain = () => () => {
  window.localStorage.setItem("locationGranted", 1);
  window.location.reload();
};

// export const authTimeout = () => dispatch => {
//   if (authInterval) clearInterval(authInterval);
//   authInterval = setInterval(() => {
//     dispatch(authenticateUser(false));
//   }, 1000 * 60 * 15);
// };

export const fetchUser = () => dispatch => {
  onAuthUserChanged(authUser => {
    if (authUser) {
      dispatch(fetchLocation(true));
      // dispatch(startConsoleWatch(true));
      dispatch(receiveAuthUser(authUser));
      getUserFeed(authUser.uid, user => {
        if (user) {
          dispatch(receiveUser(user));
        }
      });
      authUser.getIdToken().then(idToken => {
        // Parse the ID token.
        const userToken = JSON.parse(b64DecodeUnicode(idToken.split(".")[1]));
        const isManager = userToken.manager === true;
        dispatch(authenticateUser(true));
        dispatch(setManager(isManager));
      });
    } else {
      dispatch(receiveAuthUser(null));
      // dispatch(startConsoleWatch(false));
      dispatch(receiveUser(null));
      dispatch(fetchLocation(null));
      dispatch(setManager(false));
      dispatch(authenticateUser(false));
    }
  });
};
