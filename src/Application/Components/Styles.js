import getMuiTheme from "material-ui/styles/getMuiTheme";
import { createMuiTheme } from "@material-ui/core/styles";

const themeColor = "rgb(112,23,208)";
const themeColorLight = "rgba(112,23,208, 0.16)";
const alertColor = "#d50000";
const textColor1 = "rgba(0,0,0,0.87)";
const textColor2 = "rgba(0,0,0,0.54)";
const textColor3 = "rgba(0,0,0,0.38)";

const textColorWhite1 = "rgba(255,255,255,0.87)";
const textColorWhite2 = "rgba(255,255,255,0.54)";
const textColorWhite3 = "rgba(255,255,255,0.38)";

export const desktopBreakPoint = 1100;
export const mobileBreakPoint = 624;

export const appTheme = createMuiTheme({
  palette: {
    primary: {
      light: themeColorLight,
      main: themeColor
    },
    secondary: {
      main: "#fff"
    },
    error: {
      main: alertColor
    }
  }
});

export const gMuiTheme = getMuiTheme({
  fontFamily: "Roboto, sans-serif",
  appBar: {
    textColor: textColor1
  },
  bottomNavigation: {
    selectedColor: themeColor
  },
  raisedButton: {
    primaryColor: themeColor,
    secondaryColor: "#fff",
    secondaryTextColor: themeColor,
    disabledColor: "rgba(45,177,47, 0.7)",
    disabledTextColor: "#fff"
  },
  palette: {
    primary1Color: themeColor,
    themeColor,
    themeColorLight,
    alertColor,
    textColor1,
    textColor2,
    textColor3,
    textColorWhite1,
    textColorWhite2,
    textColorWhite3,
    mobileBreakPoint,
    desktopBreakPoint
  },
  tabs: {
    backgroundColor: "#fff",
    textColor: textColor3,
    selectedTextColor: themeColor
  }
});
