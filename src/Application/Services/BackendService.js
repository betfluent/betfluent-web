import firebase from "../../firebase";
import { getNewUid } from "../Services/DbService";

let BASE_URL;
if (false
  // process.env.NODE_ENV === "development" ||
  // process.env.REACT_APP_FRONTEND_ENV === "debug"
) {
  BASE_URL = "https://providence-02108.herokuapp.com/api/";
} else {
  BASE_URL = "https://boston-02108.herokuapp.com/api/";
}

export const LocationService = locRequest =>
  new Promise(res => {
        fetch(`${BASE_URL}v1/identity/location`, {
          method: 'post',
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: firebase.database().ref().push().key,
            serviceType: 'CHECK_LOCATION'
          })
        })
          .then(response => response.json())
          .then(({ ok }) => {
            res(ok);
          })
          .catch(() => {
            res(undefined);
          });
      });

export const RegistrationService = (
  email,
  password,
  firstName,
  lastName,
  dob,
  address1,
  address2,
  addressCity,
  addressState,
  addressPostalCode
) =>
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user.getIdToken(true)
    })
    .then(idToken =>
      fetch(`${BASE_URL}v1/users`, {
        method: "post",
        mode: "cors",
        body: JSON.stringify({
          id: getNewUid(),
          serviceType: "NEW_USER",
          request: {
            email,
            firstName,
            lastName,
            dob,
            address1,
            address2,
            addressCity,
            addressState,
            addressPostalCode
          }
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      })
    );

export const VerificationService = payLoad =>
  new Promise(resolve => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/identity/register`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(payLoad),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(results => {
            resolve(results.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
  });

export const DepositService = sessionRequest =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/cashier/deposit`, {
          method: 'post',
          headers: {
            'content-type': 'application/json',
            token: idToken
          },
          body: JSON.stringify(sessionRequest)
        })
          .then(response => response.json())
          .then(resolve);
      });
  });

export const PaypalWithdrawService = sessionRequest =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/webcashier/withdraw`, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(sessionRequest),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          })
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === "success") {
              resolve(response.data);
            } else {
              reject(response.message);
            }
          })
          .catch(err => reject(err));
      });
  });

export const CallbackService = callbackRequest =>
  new Promise(resolve => {
    fetch(`${BASE_URL}v1/webcashier/callback`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(callbackRequest),
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    }).then(() => {
      resolve();
    });
  });

export const WithdrawService = withdrawRequest =>
  new Promise((resolve, rej) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/cashier/withdraw`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(withdrawRequest),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === "fail" || response.status === "error") {
              rej(response.message);
            } else {
              resolve("SUCCESS");
            }
          });
      });
  });

export const PromoteService = promoteRequest => 
  new Promise((resolve, rej) => {
    firebase.auth().currentUser.getIdToken(true)
    .then(idToken => {
      fetch(`${BASE_URL}v1/operator/create-manager`, {
        method: "post",
        mode: "cors",
        body: JSON.stringify(promoteRequest),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      })
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success') {
          resolve(true);
        }
      });
    })
  }) 

export const WagerService = wagerRequest =>
  new Promise((resolve, rej) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/cashier/wager`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(wagerRequest),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === "fail" || response.status === "error") {
              rej(response.message);
            } else {
              resolve("SUCCESS");
            }
          });
      });
  });

export const ContactService = payLoad =>
  new Promise((resolve, rej) => {
    fetch(`${BASE_URL}v1/public/contact`, {
      method: "post",
      body: JSON.stringify(payLoad),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res) {
          resolve("SUCCESS");
        }
      })
      .catch(err => rej(err));
  });

export const PredictionService = payLoad =>
  new Promise(resolve => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/bet/prediction`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(payLoad),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        }).then(res => resolve(res.status));
      });
  });

export const AvatarUploadService = avatarFile =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        fetch(`${BASE_URL}v1/profile/avatar`, {
          method: "post",
          body: formData,
          headers: {
            Accept: "application/json",
            token: idToken
          }
        })
          .then(res => resolve(res.status))
          .catch(err => reject(err));
      });
  });

export const GetOnFidoTokenService = () =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/identity/document/sdktoken`, {
          method: "get",
          headers: {
            Accept: "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "error") {
              reject();
            } else resolve(data.data.token);
          })
          .catch(err => reject(err));
      });
  });

export const CompleteOnFidoService = payLoad =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/identity/document/oncomplete`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(payLoad),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(data => {
            resolve(data);
          })
          .catch(err => reject(err));
      });
  });

export const VoteOnCommentService = ({ fundId, commentId, payLoad }) =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/funds/${fundId}/comments/${commentId}/vote`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(payLoad),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "success") {
              resolve("success");
            } else reject("fail");
          });
      });
  });

export const ReportCommentService = ({ commentId, fundId, payLoad }) =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/funds/${fundId}/comments/${commentId}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify(payLoad),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "success") {
              resolve("success");
            } else reject("fail");
          });
      });
  });

export const DeleteCommentService = ({ commentId, fundId }) =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        fetch(`${BASE_URL}v1/funds/${fundId}/comments/${commentId}`, {
          method: "delete",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: idToken
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "success") {
              resolve("success");
            } else reject("fail");
          });
      });
  });

export const VerifyEmailService = emailCode =>
  fetch(`${BASE_URL}v1/users/verify-email`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      id: getNewUid(),
      serviceType: "VERIFY_EMAIL",
      request: emailCode
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
