// @flow
/* eslint-disable */
/* eslint-disable */
import React, { Component } from "react";
import { gMuiTheme } from "../Styles";

const mobileBreakPoint = gMuiTheme.palette.mobileBreakPoint;

type ScrollProps = {
  size: number
};

export const scrollComponent = WrappedComponent =>
  class ScrollComponent extends Component<ScrollProps> {
    /* eslint-disable no-param-reassign */
    onTabContentScroll = (container, height) => {
      const divHeight =
        this.props.size > mobileBreakPoint
          ? window.innerHeight - this.header.getBoundingClientRect().top - 48
          : window.innerHeight - this.header.getBoundingClientRect().top - 112;

      if (
        container.scrollTop > this.scrollPosition &&
        container.scrollTop > 0
      ) {
        container.style.maxHeight = `${divHeight}px`;
        this.header.style.height = 0;
        if (this.collapsed) this.collapsed.style.opacity = 1;
      } else if (container.scrollTop + divHeight < container.scrollHeight) {
        this.header.style.height = this.headerHeight;
        if (this.collapsed) this.collapsed.style.opacity = 0;
        container.style.maxHeight = height;
      }
      this.scrollPosition = container.scrollTop;
    };
    /* eslint-enable no-param-reassign */

    scrollBack = container => {
      this.header.style.height = this.headerHeight;
      const headerHeightValue = Number(this.headerHeight.slice(0, -2));
      if (this.collapsed) this.collapsed.style.opacity = 0;
      const allHeight = `${
        this.props.size > mobileBreakPoint
          ? window.innerHeight - headerHeightValue - 172
          : window.innerHeight - headerHeightValue - 238
      }px`;
      /* eslint-disable-next-line */
      container.style.maxHeight = allHeight;
    };

    receiveHeader = header => {
      this.header = header;
      this.headerHeight = header.style.height;
    };

    receiveCollapsed = collapsed => {
      this.collapsed = collapsed;
    };

    receiveContainer = container => {
      const containerHeight = container.style.maxHeight;
      this.scrollPosition = 0;
      /* eslint-disable-next-line */
      container.onscroll = () =>
        this.onTabContentScroll(container, containerHeight);
    };

    render() {
      return (
        <WrappedComponent
          sendHeader={this.receiveHeader}
          sendCollapsed={this.receiveCollapsed}
          sendContainer={this.receiveContainer}
          scrollBack={this.scrollBack}
          {...this.props}
        />
      );
    }
  };
