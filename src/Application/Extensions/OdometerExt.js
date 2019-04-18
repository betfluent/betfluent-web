// @flow

import ReactOdometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";
import "../../Styles/Odometer.css";

export default class OdometerExt extends ReactOdometer {
  static defaultProps = {
    format: "(,ddd).ddd"
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      window.setTimeout(() => {
        this.odometer.update(this.props.value);
      }, 1500);
    }
  }
}
