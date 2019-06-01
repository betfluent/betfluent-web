/* eslint-disable */

import React, { Component } from "react";
import { connect } from 'react-redux';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { PromoteService } from "../../Services/BackendService";
import { setManager } from "../../Actions";
import { getNewUid } from "../../Services/DbService";
import { gMuiTheme } from "../Styles";
import * as createPoolImg from './DialogAssets/create-pool.svg';
import * as first from './DialogAssets/first.svg';
import * as second from './DialogAssets/second.svg';
import * as third from './DialogAssets/third.svg';
import * as fourth from './DialogAssets/fourth.svg';
import * as arrow from './DialogAssets/arrow.svg';
import * as restricted from './DialogAssets/restricted.svg';
import './PromoteDialog.css';

const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const themeColor = gMuiTheme.palette.themeColor;


class PromoteDialog extends Component {
  constructor() {
    super();
    this.onPromoteUser = this.onPromoteUser.bind(this);
    this.state = {};
  }

  onPromoteUser() {
    this.setState({ disabled: true });

    const promoteRequest = {
      id: getNewUid(),
      serviceType: "CREATE_MANAGER",
      deviceLocation: {},
      request: {
        name: this.props.user.name,
        userId: this.props.user.id,
        company: ""
      }
    };

    PromoteService(promoteRequest)
      .then((success) => {
        if (success) {
          PromoteService(promoteRequest)
            .then(() => {
              this.props.authUser.reload();
              setTimeout(() => {
                window.location.reload(false);
              }, 3000);
          });
        }
      })
    return null;
  }

  render() {
    const wagerTitleStyle = {
      textAlign: "center",
      color: themeColor
    };

    const subTitleStyle = {
      color: textColor1,
      width: 215,
      fontSize: "12px",
      fontWeight: 400,
      margin: "0 auto",
      textAlign: "center"
    }

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

    const modalStyle = {
      width: this.props.size > 340 ? 350 : 310,
      transform: this.props.size > 375 ? "translate(0, 64px)" : "translate(0, 16px)"
    };

    const actions = [
      <RaisedButton
        key={0}
        label="I'M READY"
        style={buttonStyle}
        disabled={this.state.disabled || !this.props.emailVerified}
        primary
        fullWidth
        onClick={this.onPromoteUser}
      />,
      <FlatButton
        key={1}
        label="CANCEL"
        style={buttonStyle}
        primary
        fullWidth
        onClick={this.props.handleClose}
      />
    ];

    if (!this.props.approved) {
      return (
        <MuiThemeProvider muiTheme={gMuiTheme}>
            <Dialog
                title="LOCATION RESTRICTED"
                titleStyle={wagerTitleStyle}
                actions={[actions[1]]}
                actionsContainerStyle={buttonContainerStyle}
                modal
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                bodyClassName="proper-manager-modal-height"
                bodyStyle={{ minHeight: 356, overflowX: "hidden", overflowY: "scroll" }}
                contentStyle={modalStyle}
                paperClassName="global-modal-paper"
                className="global-modal-style"
                style={{ overflowY: "scroll" }}
            >
                <div style={subTitleStyle}>
                    <div className="manager-modal-restricted">
                        SORRY! THE STATE YOU ARE IN PROHIBITS THIS FEATURE
                    </div>
                    <div className="manager-restricted-wrapper">
                      <img src={restricted} alt="restricted location" />
                    </div>
                </div>
            </Dialog>
        </MuiThemeProvider>
      );
    }

    return (
        <MuiThemeProvider muiTheme={gMuiTheme}>
            <Dialog
                title="Become An Influencer"
                titleStyle={wagerTitleStyle}
                actions={actions}
                actionsContainerStyle={buttonContainerStyle}
                modal
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                bodyClassName="proper-manager-modal-height"
                bodyStyle={{ minHeight: 432, overflowX: "hidden", overflowY: "scroll" }}
                contentStyle={modalStyle}
                paperClassName="global-modal-paper"
                className="global-modal-style"
                style={{ overflowY: "scroll" }}
            >
                <div style={subTitleStyle}>
                    <div className="manager-modal-instructions-title">HOW TO CREATE A POOL</div>
                    <div className="manager-modal-instructions">
                        <ol>
                            <li>
                                Click the CREATE POOL button on the “Create” tab.
                                <div className="create-pool-svg">
                                    <img src={createPoolImg} alt="Create Pool" />
                                </div>
                            </li>
                            <li>
                                Stage your bets by going to the OPEN tab choosing your pool and clicking the green + button.
                                <div className="row-manager-dialog">
                                    <div className="column-manager-dialog">
                                        <img src={first} alt="first" width={32} height={32} />
                                    </div>
                                    <div className="column-manager-dialog">
                                        <img src={second} alt="second" width={32} height={32} />
                                    </div>
                                    <div className="column-manager-dialog">
                                        <img src={arrow} alt="arrow" width={96} height={18} style={{ marginRight: 32 }} />
                                        <img src={third} alt="third" width={32} height={32} />
                                    </div>
                                    <div className="column-manager-dialog">
                                        <img src={arrow} alt="arrow" width={96} height={18} style={{ marginRight: 32 }} />
                                        <img src={fourth} alt="fourth" width={32} height={32} />
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </Dialog>
        </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  emailVerified: state.authUser.authUser && state.authUser.authUser.emailVerified
});

export default connect(mapStateToProps)(PromoteDialog);
