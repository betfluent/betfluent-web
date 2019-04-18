import { NotificationActions } from "material-ui-notifications";
import Firebase from "../../firebase";
import { setFcmToken } from "./DbService";

const messaging = Firebase.messaging();

export const notificationService = user => {
  const isTokenSentToServer = () =>
    window.localStorage.getItem("sentToServer") == 1;

  const setTokenSentToServer = sent => {
    window.localStorage.setItem("sentToServer", sent ? 1 : 0);
  };

  const sendTokenToServer = currentToken => {
    if (!isTokenSentToServer()) {
      setFcmToken(user.uid, currentToken);
      setTokenSentToServer(true);
    }
  };

  messaging.requestPermission().then(() => {
    messaging
      .getToken()
      .then(currentToken => {
        if (currentToken) {
          sendTokenToServer(currentToken);
        } else {
          // Show permission request.
          setTokenSentToServer(false);
        }
      })
      .catch(() => {
        setTokenSentToServer(false);
      });

    messaging.onTokenRefresh(() => {
      messaging.getToken().then(refreshedToken => {
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // ...
      });
    });
  });
};

messaging.onMessage(payload => {
  const notification = payload.notification;
  NotificationActions.addNotification({
    headerLabel: notification.title,
    title: "",
    timestamp: "Now",
    primaryColor: "#ff0000",
    text: `${notification.title} ${notification.body}`
  });
});
