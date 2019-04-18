import React from "react";
import MFB from "react-mfb";
import classnames from "classnames";

export default class MainButton extends MFB.MainButton {
  render() {
    const iconResting = classnames(
      "mfb-component__main-icon--resting material-icons",
      this.props.iconResting
    );
    const iconActive = classnames(
      "mfb-component__main-icon--active material-icons",
      this.props.iconActive
    );
    const mainClass = classnames(
      "mfb-component__button--main",
      this.props.className
    );

    if (this.props.label) {
      return (
        <a
          href={this.props.href}
          style={this.props.style}
          className={mainClass}
          onClick={this.props.onClick}
          data-mfb-label={this.props.label}
        >
          <i className={iconResting}>add</i>
          <i className={iconActive}>clear</i>
        </a>
      );
    }
    return (
      <a
        href={this.props.href}
        style={this.props.style}
        className={mainClass}
        onClick={this.props.onClick}
      >
        <i className={iconResting}>add</i>
        <i className={iconActive}>clear</i>
      </a>
    );
  }
}
