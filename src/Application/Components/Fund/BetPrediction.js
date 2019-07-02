// @flow
/* eslint-disable */

import React, { Component } from "react";
import ThumbUp from "material-ui/svg-icons/action/thumb-up";
import ThumbDown from "material-ui/svg-icons/action/thumb-down";
import { gMuiTheme } from "../Styles";
import { getNewUid } from "../../Services/DbService";
import { PredictionService } from "../../Services/BackendService";
import Fund from "../../Models/Fund";
import Game from "../../Models/Game";
import Bet from "../../Models/Bet";
import OdometerExt from "../../Extensions/OdometerExt";

const themeColor = gMuiTheme.palette.themeColor;
const textColor3 = gMuiTheme.palette.textColor3;

type BetPredictionProps = {
  fund: Fund,
  game: Game,
  bet: Bet,
  willWin: ?boolean,
  location: {},
  firstPrediction: boolean,
  size: number
};

type OdometerProps = {
  value: number
};

const ThumbPercent = (props: OdometerProps) => (
  <OdometerExt value={props.value || 0} format="d" />
);

export default class BetPrediction extends Component<BetPredictionProps> {
  componentDidMount() {
    if (!this.thumbsInit) this.initThumbs();
  }

  componentDidUpdate() {
    if (!this.thumbsInit) this.initThumbs();
    if (this.props.willWin !== undefined) this.colorThumb(this.props.willWin);
  }

  onMouseEnter(thumb) {
    if (this.props.willWin === undefined) {
      if (thumb === "thumbUp") {
        this.thumbUpContainer.style.cursor = "pointer";
        this.thumbUpContainer.childNodes[0].style.color = themeColor;
        this.thumbUpContainer.childNodes[1].style.color = themeColor;
      } else {
        this.thumbDownContainer.style.cursor = "pointer";
        this.thumbDownContainer.childNodes[0].style.color = themeColor;
        this.thumbDownContainer.childNodes[1].style.color = themeColor;
      }
    }
  }

  onMouseLeave(thumb) {
    if (this.props.willWin === undefined) {
      if (thumb === "thumbUp") {
        this.thumbUpContainer.style.cursor = "auto";
        this.thumbUpContainer.childNodes[0].style.color = textColor3;
        this.thumbUpContainer.childNodes[1].style.color = textColor3;
      } else {
        this.thumbDownContainer.style.cursor = "auto";
        this.thumbDownContainer.childNodes[0].style.color = textColor3;
        this.thumbDownContainer.childNodes[1].style.color = textColor3;
      }
    }
  }

  colorThumb = willWin => {
    if (willWin) {
      this.thumbUpContainer.childNodes[0].style.color = themeColor;
      this.thumbUpContainer.childNodes[1].style.color = themeColor;
      this.thumbDownContainer.childNodes[0].style.color = textColor3;
      this.thumbDownContainer.childNodes[1].style.color = textColor3;
    } else {
      this.thumbDownContainer.childNodes[0].style.color = themeColor;
      this.thumbDownContainer.childNodes[1].style.color = themeColor;
      this.thumbUpContainer.childNodes[0].style.color = textColor3;
      this.thumbUpContainer.childNodes[1].style.color = textColor3;
    }
  };

  initThumbs() {
    if (this.thumbUpContainer && this.thumbDownContainer) {
      this.thumbsInit = true;
      if (typeof this.props.willWin === "boolean") {
        this.thumbUpContainer.style.cursor = "auto";
        this.thumbDownContainer.style.cursor = "auto";
        this.colorThumb(this.props.willWin);
      } else {
        this.thumbUpContainer.childNodes[0].style.color = textColor3;
        this.thumbUpContainer.childNodes[1].style.color = textColor3;
        this.thumbDownContainer.childNodes[0].style.color = textColor3;
        this.thumbDownContainer.childNodes[1].style.color = textColor3;
      }
    }
  }

  actionPredict = props => {
    if (this.props.willWin === undefined) {
      const payLoad = {
        id: getNewUid(),
        serviceType: "PREDICTION",
        deviceLocation: this.props.location,
        request: {
          bet: props.bet,
          willWin: props.willWin
        }
      };
      PredictionService(payLoad).then(res => {
        if (res) {
          this.thumbUpContainer.style.cursor = "auto";
          this.thumbDownContainer.style.cursor = "auto";
          this.colorThumb(props.willWin);
        }
      });
    }
  };

  render() {
    const game = this.props.game;
    const bet = this.props.bet;

    if (
      (game.status === "complete" || game.status === "closed") &&
      this.props.willWin === undefined
    )
      return null;

    let agreePct;
    let disagreePct;
    if (bet.agreeCount + bet.disagreeCount > 0) {
      agreePct = Math.round(
        bet.agreeCount * 100 / (bet.agreeCount + bet.disagreeCount)
      );
      disagreePct = Math.round(
        bet.disagreeCount * 100 / (bet.agreeCount + bet.disagreeCount)
      );
    }

    return (
      <div className="btbThumbs" style={{ color: textColor3 }}>
        <div className="flexContainer">
          <div
            ref={thumbUpContainer => {
              this.thumbUpContainer = thumbUpContainer;
            }}
            className="thumbUp"
            title="Agree"
            onMouseEnter={() => this.onMouseEnter("thumbUp")}
            onMouseLeave={() => this.onMouseLeave("thumbUp")}
          >
            <ThumbUp
              onClick={e => {
                e.preventDefault();
                this.actionPredict({ bet, willWin: true });
              }}
            />
            <span>
              <ThumbPercent value={agreePct} />%
            </span>
          </div>
          <div
            ref={thumbDownContainer => {
              this.thumbDownContainer = thumbDownContainer;
            }}
            className="thumbDown"
            title="Disagree"
            onMouseEnter={() => this.onMouseEnter("thumbDown")}
            onMouseLeave={() => this.onMouseLeave("thumbDown")}
          >
            <ThumbDown
              onClick={e => {
                e.preventDefault();
                this.actionPredict({ bet, willWin: false });
              }}
            />
            <span>
              <ThumbPercent value={disagreePct} />%
            </span>
          </div>
        </div>
      </div>
    );
  }
}
