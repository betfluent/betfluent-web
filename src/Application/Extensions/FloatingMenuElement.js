import React from "react";
import { Link } from "react-router-dom";
import MFB from "react-mfb";
import classnames from "classnames";

export default class ChildButton extends MFB.ChildButton {
  handleOnClick(e) {
    if (this.props.disabled === true) {
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    const iconClass = classnames(
      "mfb-component__child-icon material-icons",
      this.props.iconClass
    );
    const className = classnames(
      "mfb-component__button--child",
      this.props.className,
      { "mfb-component__button--disabled": this.props.disabled }
    );

    return (
      <li>
        <Link
          to={this.props.href ? this.props.href : "#"}
          data-mfb-label={this.props.label}
          onClick={this.handleOnClick}
          style={this.props.style}
          className={className}
        >
          <i className={iconClass}>{this.props.icon}</i>
        </Link>
      </li>
    );
  }
}
