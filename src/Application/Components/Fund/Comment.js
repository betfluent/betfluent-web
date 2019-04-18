// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import ThumbUp from "material-ui/svg-icons/action/thumb-up";
import ThumbDown from "material-ui/svg-icons/action/thumb-down";
import Divider from "material-ui/Divider";
import Snackbar from "material-ui/Snackbar";
import Flag from "material-ui/svg-icons/content/flag";
import Avatar from "../Avatar";
import { getPublicUser, getManager, getNewUid } from "../../Services/DbService";
import {
  VoteOnCommentService,
  ReportCommentService,
  DeleteCommentService
} from "../../Services/BackendService";
import { gMuiTheme } from "../Styles";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor3 = gMuiTheme.palette.textColor3;
const alertColor = gMuiTheme.palette.alertColor;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

moment.defineLocale("en-1", {
  parentLocale: "en",
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
  }
});

type CommentsProps = {
  publicUserId: string,
  comment: string,
  createdTimeMillis: number,
  voteCount: number,
  votes: {},
  user: User,
  location: {},
  fund: Fund,
  id: string,
  reportedTimeMillis: number,
  isManager: boolean,
  size: number
};

export default class Comments extends Component<CommentsProps> {
  state = {
    openSnackbar: false
  };

  componentDidMount() {
    let userFunction;
    if (this.props.isManager) userFunction = getManager;
    else userFunction = getPublicUser;
    userFunction(this.props.publicUserId).then(publicUser => {
      this.setState({ publicUser });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.votes)
      this.colorThumb(nextProps.votes[nextProps.user.publicId]);
    else this.colorThumb(null);
  }

  componentDidUpdate() {
    if (this.props.votes)
      this.colorThumb(this.props.votes[this.props.user.publicId]);
    else this.colorThumb(null);
  }

  onMouseEnter(thumb) {
    if (thumb === "thumbUp") {
      this.thumbUpContainer.style.cursor = "pointer";
      if (
        !this.props.votes ||
        this.props.votes[this.props.user.publicId] !== true
      ) {
        this.thumbUpContainer.childNodes[0].style.color = themeColor;
      } else this.thumbUpContainer.childNodes[0].style.color = textColor3;
    } else {
      this.thumbDownContainer.style.cursor = "pointer";
      if (
        !this.props.votes ||
        this.props.votes[this.props.user.publicId] !== false
      ) {
        this.thumbDownContainer.childNodes[0].style.color = themeColor;
      } else this.thumbDownContainer.childNodes[0].style.color = textColor3;
    }
  }

  onMouseLeave(thumb) {
    if (thumb === "thumbUp") {
      this.thumbUpContainer.style.cursor = "auto";
      if (
        !this.props.votes ||
        this.props.votes[this.props.user.publicId] !== true
      ) {
        this.thumbUpContainer.childNodes[0].style.color = textColor3;
      } else this.thumbUpContainer.childNodes[0].style.color = themeColor;
    } else {
      this.thumbDownContainer.style.cursor = "auto";
      if (
        !this.props.votes ||
        this.props.votes[this.props.user.publicId] !== false
      ) {
        this.thumbDownContainer.childNodes[0].style.color = textColor3;
      } else this.thumbDownContainer.childNodes[0].style.color = themeColor;
    }
  }

  colorThumb = upvote => {
    if (this.thumbUpContainer && this.thumbDownContainer) {
      if (upvote === true) {
        this.thumbUpContainer.childNodes[0].style.color = themeColor;
        this.thumbDownContainer.childNodes[0].style.color = textColor3;
      } else if (upvote === false) {
        this.thumbDownContainer.childNodes[0].style.color = themeColor;
        this.thumbUpContainer.childNodes[0].style.color = textColor3;
      } else {
        this.thumbDownContainer.childNodes[0].style.color = textColor3;
        this.thumbUpContainer.childNodes[0].style.color = textColor3;
      }
    }
  };

  actionVote = props => {
    const payLoad = {
      id: getNewUid(),
      serviceType: "VOTE",
      deviceLocation: this.props.location,
      request: {
        vote: props.vote
      }
    };
    const fundId = this.props.fund.id;
    const commentId = this.props.id;
    if (commentId && fundId) {
      VoteOnCommentService({ payLoad, fundId, commentId });
    }
  };

  deleteComment = () => {
    const fundId = this.props.fund.id;
    const commentId = this.props.id;
    if (fundId && commentId) {
      DeleteCommentService({ fundId, commentId });
    }
  };

  reportComment = () => {
    const payLoad = {
      reportedTimeMillis: true
    };
    const fundId = this.props.fund.id;
    const commentId = this.props.id;
    if (commentId && fundId) {
      ReportCommentService({ commentId, fundId, payLoad });
      this.setState({ openSnackbar: false });
    }
  };

  render() {
    if (!this.state.publicUser) return null;

    return (
      <div style={{ marginBottom: 16, position: "relative" }}>
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            right: 0,
            top: 0
          }}
        >
          <div
            ref={thumbUpContainer => {
              this.thumbUpContainer = thumbUpContainer;
            }}
            className="thumbUp"
            title="Like"
            onMouseEnter={() => this.onMouseEnter("thumbUp")}
            onMouseLeave={() => this.onMouseLeave("thumbUp")}
          >
            <ThumbUp
              onClick={e => {
                e.preventDefault();
                this.actionVote({ vote: true });
              }}
            />
          </div>
          <div
            style={{ textAlign: "center", fontSize: "16px", margin: "5px 0" }}
          >
            {this.props.voteCount ? this.props.voteCount : 0}
          </div>
          <div
            ref={thumbDownContainer => {
              this.thumbDownContainer = thumbDownContainer;
            }}
            className="thumbDown"
            title="Dislike"
            onMouseEnter={() => this.onMouseEnter("thumbDown")}
            onMouseLeave={() => this.onMouseLeave("thumbDown")}
          >
            <ThumbDown
              onClick={e => {
                e.preventDefault();
                this.actionVote({ vote: false });
              }}
            />
          </div>
        </div>
        <div className="flexContainer commentUserinfo">
          <Avatar
            userName={this.state.publicUser.name}
            userAvatar={this.state.publicUser.avatarUrl}
            width={25}
          />
          <div>
            <b>{this.state.publicUser.name}</b>{" "}
            <Moment
              locale="en-1"
              fromNow
              ago
              date={this.props.createdTimeMillis}
            />{" "}
            ago
          </div>
          {this.props.reportedTimeMillis && this.props.user.manager ? (
            <span className="reportedFlag">
              <Flag color={alertColor} />
            </span>
          ) : null}
        </div>
        <div
          style={{
            fontSize: 16,
            marginBottom: 24,
            width: "80%",
            display: "inline-block"
          }}
        >
          {this.props.comment}
        </div>
        <div style={{ bottom: 10, position: "relative" }}>
          {this.props.user.manager ? (
            <span>
              <Link to="#" onClick={this.deleteComment} className="deleteBtn">
                Delete
              </Link>
            </span>
          ) : (
            <Link
              to="#"
              onClick={() => {
                this.setState({ openSnackbar: true });
              }}
              className="reportBtn"
            >
              Report
            </Link>
          )}
        </div>
        <Divider />
        <Snackbar
          style={{
            minWidth: 300,
            bottom: this.props.size < mobileBreakPoint ? 56 : 0
          }}
          bodyStyle={{
            width: "100%",
            maxWidth: "100vw",
            backgroundColor: textColor1
          }}
          contentStyle={{
            width: "100%",
            maxWidth: 724,
            margin: "auto",
            textAlign: "left",
            fontSize: 12,
            lineHeight: "48px"
          }}
          open={this.state.openSnackbar}
          onRequestClose={() => {
            this.setState({ openSnackbar: false });
          }}
          action={[
            <span key={0} style={{ color: "#fff", cursor: "pointer" }}>
              Confirm
            </span>
          ]}
          onActionClick={this.reportComment}
          message="Report this comment?"
        />
      </div>
    );
  }
}
