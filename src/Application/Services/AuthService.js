import firebase from "../../firebase";

export const doesEmailExist = emailAddress =>
  firebase
    .auth()
    .fetchSignInMethodsForEmail(emailAddress)
    .then(signInMethods => signInMethods.length > 0);

export const onAuthUserChanged = callback => {
  firebase.auth().onAuthStateChanged(authUser => {
    callback(authUser);
  });
};

export const reauthenticateWithEmail = (email, password) => {
  if (!firebase.auth().currentUser) {
    return Promise.reject(new Error("No user is signed in to reauthenticate."));
  }
  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    password
  );
  return firebase
    .auth()
    .currentUser.reauthenticateAndRetrieveDataWithCredential(credential);
};

export const sendPasswordResetEmail = email =>
  firebase.auth().sendPasswordResetEmail(email);

export const signInWithEmail = (email, password, rememberUser) =>
  firebase
    .auth()
    .setPersistence(
      rememberUser
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION
    )
    .then(() => firebase.auth().signInWithEmailAndPassword(email, password));

export const signOut = () => firebase.auth().signOut();
