// @flow
/* eslint-disable */
/* eslint-disable */
import React from "react";
import Dialog from "material-ui/Dialog";
import Lottie from "react-lottie";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "../Styles";
import checkingLocation from "../../../Assets/checkingLocation.json";

const checkingLocationOptions = {
  loop: true,
  autoplay: true,
  animationData: checkingLocation
};

type CheckingLocationModalProps = {
  size: number,
  open: boolean
};

const CheckingLocationModal = (props: CheckingLocationModalProps) => (
  <MuiThemeProvider muiTheme={gMuiTheme}>
    <Dialog
      title="Checking Location"
      titleStyle={{ textAlign: "center" }}
      modal
      open={props.open}
      bodyStyle={{ height: 150, overflowX: "hidden" }}
      contentStyle={{ width: props.size > 340 ? 350 : 310 }}
      paperProps={{ style: { height: 300 } }}
      style={{ overflowY: "scroll" }}
    >
      <div style={{ textAlign: "center" }}>
        <div>Please wait while we check location...</div>
        <div style={{ position: "relative", top: -64 }}>
          <Lottie options={checkingLocationOptions} />
        </div>
      </div>
    </Dialog>
  </MuiThemeProvider>
);

export default CheckingLocationModal;
