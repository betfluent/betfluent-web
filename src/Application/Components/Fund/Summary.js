// @flow
/* eslint-disable */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon
} from 'react-share';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Fund from "../../Models/Fund";
import Comment from "./Comment";
import { gMuiTheme } from "../Styles";
import {
  getFundDetails,
  getCommentsFeed,
  uploadComment
} from "../../Services/DbService";
import "../../../Styles/Summary.css";
import usaFlag from "../../../Assets/usaFlag.png";
import Avatar from "../Avatar";
import PotentialGames from "../Shared/PotentialGames";

const themeColor = gMuiTheme.palette.themeColor;
const textColor1 = gMuiTheme.palette.textColor1;
const textColor2 = gMuiTheme.palette.textColor2;
const textColor3 = gMuiTheme.palette.textColor3;
const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type SummaryProps = {
  fund: Fund,
  user: User,
  size: number,
  location: {},
  isManager: boolean,
  allowComments: boolean,
  size: number
};

export default class Summary extends Component<SummaryProps> {
  constructor() {
    super();
    this.state = {
      potentialGames: []
    };
  }

  componentDidMount() {
    if (!this.blogRendered && this.props.fund) this.renderSummary();
    if (this.props.fund)
      this.comments = getCommentsFeed(this.props.fund.id, this.commentsFeed);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fund && !this.comments)
      this.comments = getCommentsFeed(nextProps.fund.id, this.commentsFeed);
  }

  componentDidUpdate() {
    if (!this.blogRendered && this.props.fund) this.renderSummary();
  }

  componentWillUnmount() {
    this.comments.off();
  }

  /* eslint-disable no-param-reassign */
  commentsFeed = comments => {
    comments = comments.sort((a, b) => {
      if (b.voteCount || a.voteCount) {
        return (b.voteCount || 0) - (a.voteCount || 0);
      }
      return b.time - a.time;
    });
    this.setState({ comments });
  };
  /* eslint-enable no-param-reassign */

  addComment = (e, addComment) => {
    this.setState({ addComment });
  };

  pushComment = () => {
    const comment = this.state.addComment;
    let publicUserId;
    const isManager = this.props.isManager;
    if (isManager) publicUserId = this.props.user.managerId;
    else publicUserId = this.props.user.publicId;
    const fundId = this.props.fund.id;
    uploadComment({ comment, publicUserId, fundId, isManager });
    const addComment = "";
    this.setState({ addComment });
  };

  renderSummary = () => {
    getFundDetails(this.props.fund.id).then(details => {
      if (details) {
        if (this.summary) {
          this.blogRendered = true;
          this.summary.innerHTML = details.summaryHtml;
        }
        if (details.potentialGames) {
          this.setState({ potentialGames: details.potentialGames });
        }
      }
    });
  };

  render() {
    const fund = this.props.fund;

    const summaryStyle = {
      margin: "16px 0",
      fontSize: 16,
      lineHeight: "24px",
      color: textColor2
    };

    return (
      <div className="tabContent">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link
            to={`/managers/${fund.manager.id}`}
            className="flexContainer"
            style={{ justifyContent: "flex-start" }}
          >
            
            <div
              className="poweredByDetail flexContainer"
              style={{ alignItems: "center" }}
            >
              <Avatar
                width={50}
                userName={fund.manager.name}
                userAvatar={fund.manager.avatarUrl}
              />
              <div
                style={{
                  marginLeft: 8,
                  fontSize: 12
                }}
              >
                <div style={{ color: textColor1 }}>
                  {fund.manager.name}{" "}
                  <span style={{ color: themeColor, fontWeight: 500 }}>
                    · PROFILE
                  </span>
                </div>
                <div style={{ color: textColor3 }}>{fund.manager.company}</div>
                {/* <Moment format="M/D/YY @ h:mm A" date={fund.createdTimeMillis} /> */}
                <Moment fromNow>{fund.createdTimeMillis}</Moment>
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', width: 180, justifyContent: 'space-between' }}>
            <FacebookShareButton
              url={`www.betfluent.com/pools/${fund.id}`}
              quote='betFluent'
              className="Demo__some-network__share-button"
            >
              <FacebookIcon
                size={32}
                round
              />
            </FacebookShareButton>
            <LinkedinShareButton
              url={`www.betfluent.com/pools/${fund.id}`}
              quote='betFluent'
              className="Demo__some-network__share-button"
            >
              <LinkedinIcon
                size={32}
                round
              />
            </LinkedinShareButton>
            <TwitterShareButton
              url={`www.betfluent.com/pools/${fund.id}`}
              quote='betFluent'
              className="Demo__some-network__share-button"
            >
              <TwitterIcon
                size={32}
                round
              />
            </TwitterShareButton>
            <WhatsappShareButton
              url={`www.betfluent.com/pools/${fund.id}`}
              quote='betFluent'
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon
                size={32}
                round
              />
            </WhatsappShareButton>
            <RedditShareButton
              url={`www.betfluent.com/pools/${fund.id}`}
              quote='betFluent'
              className="Demo__some-network__share-button"
            >
              <RedditIcon
                size={32}
                round
              />
            </RedditShareButton>
          </div>
        </div>

        {this.state.potentialGames.length > 0 ? (
          <div>
            <div className="potentialGamesCopy" style={{ color: textColor2 }}>
              {fund.manager.name} WILL BET ON THE FOLLOWING GAME:
            </div>
            <PotentialGames selectedGames={this.state.potentialGames} />
          </div>
        ) : null}

        <div className="entry-content">
          <div
            style={summaryStyle}
            ref={el => {
              this.summary = el;
            }}
          />
          <hr />
        </div>
        <div style={summaryStyle}>
          <b>Comments</b>
        </div>
        {this.state.comments
          ? this.state.comments.map(comment => (
              <Comment
                key={comment.id}
                {...comment}
                user={this.props.user}
                fund={this.props.fund}
                location={this.props.location}
                size={this.props.size}
              />
            ))
          : null}
        {this.props.allowComments ? (
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 8 }}>Add Comment:</div>
            <TextField
              id="comment"
              multiLine
              rows={3}
              value={this.state.addComment}
              onChange={this.addComment}
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 2
              }}
              textareaStyle={{ padding: "0 16px" }}
            />
            <RaisedButton
              secondary
              disabled={!this.state.addComment}
              disabledBackgroundColor="#fff"
              disabledLabelColor="rgba(22, 106, 255, 0.7)"
              onClick={this.pushComment}
              label="ADD COMMENT"
              style={{ margin: "10px 0" }}
            />
          </div>
        ) : null}
        <div
          style={{ marginTop: this.props.size > mobileBreakPoint ? 80 : 72 }}
        >
          <p className="copyRight">
            <img src={usaFlag} alt="Based in the USA" /> © 2019 Betfluent
            All Rights Reserved
          </p>
        </div>
      </div>
    );
  }
}
