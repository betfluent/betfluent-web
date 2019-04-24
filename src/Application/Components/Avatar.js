// @flow
/* eslint-disable */

import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import Snackbar from "material-ui/Snackbar";
import { gMuiTheme } from "./Styles";
import { mgMuiTheme } from "./ManagerStyles";
import { AvatarUploadService } from "../Services/BackendService";
import { ManagerAvatarUploadService } from "../Services/ManagerService";

const themeColor = gMuiTheme.palette.themeColor;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const managerThemeColor = mgMuiTheme.palette.themeColor;

type AvatarProps = {
  width: number,
  userName: string,
  userAvatar: string,
  isManager: boolean,
  allowUpload: boolean
};

export default class Avatar extends Component<AvatarProps> {
  constructor(props) {
    super(props);
    this.userName = props.userName;
    this.onFileChange = this.onFileChange.bind(this);
    this.renderSnackbarColor = this.renderSnackbarColor.bind(this);
    this.state = {
      open: false,
      autoHideDuration: 3000,
      fileError: false,
      message: "",
      userAvatar: props.userAvatar
    };
  }

  onFileChange(e) {
    try {
      const fileSize = e.target.files[0].size / 1024 / 1024;
      if (fileSize > 40) {
        this.setState({
          open: true,
          fileError: true,
          message: "The maximum file size is 40MB"
        });
      } else {
        this.setState({
          open: true,
          fileError: false,
          message: "Upload Succeed"
        });
        if (this.props.isManager) {
          ManagerAvatarUploadService(e.target.files[0]);
        } else {
          AvatarUploadService(e.target.files[0]);
        }
      }
    } catch (error) {
      this.setState({
        open: true,
        fileError: true,
        message: "Problem uploading file"
      });
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  renderAvatarImg(userName, userAvatar) {
    const nameArray = userName.split(" ");
    const initialsArray = nameArray.map(name => name[0]);
    const initials = initialsArray.toString().replace(",", "");
    if (userAvatar) {
      return (
        <div
          className="avatarImg"
          style={{
            width: this.props.width,
            height: this.props.width
          }}
        >
          <img src={userAvatar} alt={userName} />
        </div>
      );
    }
    return (
      <div
        className="avatarImg"
        style={{
          backgroundColor: textColor3,
          width: this.props.width,
          height: this.props.width,
          lineHeight: `${this.props.width}px`,
          fontSize: Number(this.props.width / 3.3)
        }}
      >
        <span>{initials}</span>
      </div>
    );
  }

  renderAvatarBtn() {
    const labelStyle = {
      fontSize: 12,
      top: -6,
      textAlign: "center"
    };

    const btnStyle = {
      color: this.props.isManager ? managerThemeColor : themeColor,
      height: 24,
      minWidth: 80
    };

    if (this.props.allowUpload) {
      return (
        <div className="avatarBtn">
          <FlatButton label="Upload" labelStyle={labelStyle} style={btnStyle}>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={this.onFileChange}
            />
          </FlatButton>
        </div>
      );
    }
    return null;
  }

  renderSnackbarColor() {
    if (this.state.fileError) {
      return alertColor;
    } else if (this.props.isManager) {
      return managerThemeColor;
    }
    return themeColor;
  }

  render() {
    const snackbarStyle = {
      width: "100vw"
    };

    const snackbarBodyStyle = {
      maxWidth: "100vw",
      width: "100%",
      textAlign: "center",
      backgroundColor: this.renderSnackbarColor(),
      color: "#fff"
    };

    return (
      <div className="avatarContainer" style={{ width: this.props.width }}>
        {this.renderAvatarImg(this.userName, this.state.userAvatar)}
        {this.renderAvatarBtn()}
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={this.state.autoHideDuration}
          onRequestClose={this.handleRequestClose}
          style={snackbarStyle}
          bodyStyle={snackbarBodyStyle}
        />
      </div>
    );
  }
}
