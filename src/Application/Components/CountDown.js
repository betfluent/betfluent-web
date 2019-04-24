// @flow
/* eslint-disable */

import React, { Component } from "react";

type CountDownProps = {
  diff: number
};

export default class CountDown extends Component<CountDownProps> {
  static secondsToTime(secs) {
    const hours = Math.floor(secs / (60 * 60));

    const divisorForMinutes = secs % (60 * 60);
    let minutes = Math.floor(divisorForMinutes / 60);
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    const divisorForSeconds = divisorForMinutes % 60;
    let seconds = Math.ceil(divisorForSeconds);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    const obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  static renderTime(minutes, seconds) {
    if (minutes) {
      if (minutes > 0) {
        return (
          <span>
            {minutes}:{seconds}
          </span>
        );
      }
      return <span>{seconds} seconds</span>;
    }
    return null;
  }

  constructor() {
    super();
    this.state = { time: {}, seconds: 0 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentWillMount() {
    const diff = this.props.diff;
    this.setState({ seconds: diff });
    const timeLeftVar = CountDown.secondsToTime(diff);
    this.setState({ time: timeLeftVar });
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    const seconds = this.state.seconds - 1;
    this.setState({
      time: CountDown.secondsToTime(seconds),
      seconds
    });

    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    return (
      <span className="countDown">
        {CountDown.renderTime(this.state.time.m, this.state.time.s)}
      </span>
    );
  }
}
