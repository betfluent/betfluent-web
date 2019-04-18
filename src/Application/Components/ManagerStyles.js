import getMuiTheme from "material-ui/styles/getMuiTheme";
import { createMuiTheme } from "@material-ui/core/styles";

const themeColor = "rgb(45,177,47)";
const themeColorLight = "rgba(45,177,47, 0.16)";
const alertColor = "#d50000";
const textColor1 = "rgba(0,0,0,0.87)";
const textColor2 = "rgba(0,0,0,0.54)";
const textColor3 = "rgba(0,0,0,0.38)";

const textColorWhite1 = "rgba(255,255,255,0.87)";
const textColorWhite2 = "rgba(255,255,255,0.54)";
const textColorWhite3 = "rgba(255,255,255,0.38)";

const mobileBreakPoint = 624;
const desktopBreakPoint = 1100;

export const mgAppTheme = createMuiTheme({
  palette: {
    primary: {
      light: themeColorLight,
      main: themeColor,
      dark: themeColor
    },
    secondary: {
      main: "#fff"
    },
    error: {
      main: alertColor
    }
  }
});

export const mgMuiTheme = getMuiTheme({
  fontFamily: "Roboto, sans-serif",
  appBar: {
    textColor: textColor1
  },
  bottomNavigation: {
    selectedColor: themeColor
  },
  raisedButton: {
    primaryColor: themeColor,
    secondaryColor: themeColor,
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
