import React from "react";
import { NotificationContainer } from "material-ui-notifications";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const NotificationContainerExt = () => (
  <MuiThemeProvider>
    <NotificationContainer />
  </MuiThemeProvider>
);

export default NotificationContainerExt;
