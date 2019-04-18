import React from "react";
import PropTypes from "prop-types";
import MFB from "react-mfb";
import classnames from "classnames";
import MainButton from "./FloatingMenuMain";
import ChildButton from "./FloatingMenuElement";

const Children = React.Children;

const childrenValidator = (props, propName, componentName) => {
  const children = props[propName];
  let mainButtonCount = 0;
  let childButtonCount = 0;
  let otherCount = 0;
  let msg;
  Children.forEach(children, child => {
    if (child.type === MainButton) {
      mainButtonCount += 1;
      return mainButtonCount;
    }
    if (child.type === ChildButton) {
      childButtonCount += 1;
      return childButtonCount;
    }
    otherCount += 1;
    return null;
  });
  if (mainButtonCount === 0) {
    msg = `Prop \`children\` must contain a MainButton component in \`${componentName}\`.`;
    return new Error(msg);
  }
  if (mainButtonCount > 1) {
    msg = `Prop \`children\` must contain only 1 MainButton component in \`${componentName}\`, but ${mainButtonCount} exist.`;
    return new Error(msg);
  }
  if (otherCount) {
    msg = `${"Prop `children` contains elements other than MainButton and ChildButton " +
      "components in `"}${componentName}\`.`;
    return new Error(msg);
  }
  return null;
};

const getChildren = children => {
  const buttons = {
    main: null,
    child: []
  };

  Children.forEach(children, child => {
    if (child.type === MainButton) {
      buttons.main = child;
      return;
    }
    buttons.child.push(child);
  });

  return buttons;
};

const getClasses = props =>
  classnames(
    {
      "mfb-zoomin": props.effect === "zoomin",
      "mfb-slidein": props.effect === "slidein",
      "mfb-slidein-spring": props.effect === "slidein-spring",
      "mfb-fountain": props.effect === "fountain",
      "mfb-component--tl": props.position === "tl",
      "mfb-component--tr": props.position === "tr",
      "mfb-component--bl": props.position === "bl",
      "mfb-component--br": props.position === "br"
    },
    props.className
  );

export default class Menu extends MFB.Menu {
  render() {
    const classes = getClasses(this.props);
    const buttons = getChildren(this.props.children);

    const main =
      buttons.main &&
      React.cloneElement(buttons.main, {
        onClick: this.toggleMenu
      });

    return (
      <ul
        className={classes}
        data-mfb-toggle={this.props.method}
        data-mfb-state={this.state.isOpen ? "open" : "closed"}
      >
        <li className="mfb-component__wrap">
          {main}
          <ul className="mfb-component__list">{buttons.child}</ul>
        </li>
      </ul>
    );
  }
}

Menu.propTypes = {
  effect: PropTypes.oneOf(["zoomin", "slidein", "slidein-spring", "fountain"])
    .isRequired,
  position: PropTypes.oneOf(["tl", "tr", "bl", "br"]).isRequired,
  children: childrenValidator
};
