import Idle from "react-idle";
/* eslint-disable */
export default class IdleLock extends Idle {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.lock) {
      this.setState({ idle: false });
    }
  }

  handleChange(idle) {
    if (!this.props.lock) {
      this.props.onChange({ idle });
      this.setState({ idle });
    }
  }

  handleEvent = () => {
    if (this.state.idle) {
      this.handleChange(false);
    }
    if (!this.props.lock) {
      window.sessionStorage.setItem(
        "lock",
        new Date().getTime() + 1000 * 60 * 15
      );
    }
    clearTimeout(this.timeout);
    this.setTimeout();
  };
}
