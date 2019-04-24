// @flow
/* eslint-disable */
/* eslint-disable */
import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { gMuiTheme } from "../Styles";

type RestrictedLocationModalProps = {
  size: number,
  open: boolean,
  handleClose: () => void,
  behavior: string
};

const buttonContainerStyle = {
  position: "absolute",
  bottom: 15,
  left: "50%",
  transform: "translateX(-50%)",
  width: "200px",
  textAlign: "center"
};

const buttonStyle = {
  position: "relative",
  display: "block"
};

const RestrictedLocationModal = (props: RestrictedLocationModalProps) => (
  <MuiThemeProvider muiTheme={gMuiTheme}>
    <Dialog
      title="Restricted Location"
      titleStyle={{ textAlign: "center" }}
      modal
      actions={
        <RaisedButton
          label="OK"
          style={buttonStyle}
          primary
          fullWidth
          onClick={props.handleClose}
        />
      }
      actionsContainerStyle={buttonContainerStyle}
      open={props.open}
      bodyStyle={{ height: 225, overflowX: "hidden" }}
      contentStyle={{ width: props.size > 340 ? 350 : 310 }}
      paperProps={{ style: { height: 225 } }}
      style={{ overflowY: "scroll" }}
    >
      <div style={{ textAlign: "center" }}>
        You are in a restricted location. Unfortunately you cannot{" "}
        {props.behavior} at this time...
      </div>
    </Dialog>
  </MuiThemeProvider>
);

export default RestrictedLocationModal;
