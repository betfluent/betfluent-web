// @flow

import React from "react";
import Dialog from "material-ui/Dialog";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "../Styles";

type CloseConsoleModalProps = {
  size: number,
  open: boolean
};

const CloseConsoleModal = (props: CloseConsoleModalProps) => (
  <MuiThemeProvider muiTheme={gMuiTheme}>
    <Dialog
      title="Please close console"
      titleStyle={{ textAlign: "center" }}
      modal
      open={props.open}
      bodyStyle={{ height: 150, overflowX: "hidden" }}
      contentStyle={{ width: props.size > 340 ? 350 : 310 }}
      paperProps={{ style: { height: 150 } }}
      style={{ overflowY: "scroll" }}
    >
      <div style={{ textAlign: "center" }}>
        <div>Please close the console and refresh the page to continue...</div>
      </div>
    </Dialog>
  </MuiThemeProvider>
);

export default CloseConsoleModal;
