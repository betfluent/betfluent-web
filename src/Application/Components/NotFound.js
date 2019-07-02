// @flow
/* eslint-disable */

import React, { Component } from "react";
import ErrorPic from "../../Assets/404.png";

export default class NotFound extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const picStyle = {
      width: "50vw",
      position: "relative",
      top: "50vh",
      transform: "translateY(-50%)"
    };

    return (
      <div style={{ height: "100vh" }}>
        <img src={ErrorPic} alt="404 Not Found" style={picStyle} />
      </div>
    );
  }
}
