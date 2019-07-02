import moment from "moment";
import firebase from "../../firebase";
import { getNewUid, getTeam } from "./DbService";
import Bet from "../Models/Bet";
import Game from "../Models/Game";
import Fund from "../Models/Fund";

let BASE_URL;
if (
  process.env.NODE_ENV === "development" ||
  process.env.REACT_APP_FRONTEND_ENV === "debug"
) {
  BASE_URL = "https://providence-02108.herokuapp.com/api/";
} else {
  BASE_URL = "https://boston-02108.herokuapp.com/api/";
}

function getListFeed(ref, callback, Model) {
  const feed = ref.on("value", snapshot => {
    const objSnap = snapshot.val();
    let arr = snapshot.val() ? Object.keys(objSnap).map(k => objSnap[k]) : [];
    if (Model) arr = arr.map(obj => new Model(obj));
    callback(arr);
  });
  return { off: () => ref.off("value", feed) };
}

export function updateFund(fund) {
  firebase
    .database()
    .ref("funds")
    .child(fund.id)
    .update(fund);
}

export function deleteFund(fundId) {
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken => {
      fetch(`${BASE_URL}v1/funds/${fundId}`, {
        method: "delete",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      });
    });
}

export function createFund(fund) {
  const fundRef = firebase
    .database()
    .ref("funds")
    .push();
  fund.id = fundRef.key; // eslint-disable-line no-param-reassign
  fundRef.set(fund);
  return fundRef.key;
}

export function updateFundDetails(fundId, details) {
  if (typeof fundId !== "string" || fundId.trim().length === 0) {
    return Promise.reject(new Error("fundId must be a non-blank string"));
  }
  if (!details || typeof details !== "object") {
    return Promise.reject(new Error("details must be a non-empty object"));
  }
  return firebase
    .database()
    .ref("fundDetails")
    .child(fundId)
    .update(details);
}

export const closeFund = fundId =>
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken =>
      fetch(`${BASE_URL}v1/funds/${fundId}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ closeFund: true }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      })
    )
    .then(response => response.json());

export const openFund = fundId =>
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken =>
      fetch(`${BASE_URL}v1/funds/${fundId}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ openFund: true }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      })
    )
    .then(response => response.json());

export async function getLinesForGame(gameLeague, gameId) {
  const snapshot = await firebase
    .database()
    .ref("lines")
    .child(gameLeague.toLowerCase())
    .child(gameId)
    .child("consensus")
    .once("value");
  return snapshot.val();
}

export async function getGame(league, gameId) {
  const snapshot = await firebase
    .database()
    .ref(league.toLowerCase())
    .child("games")
    .child(gameId)
    .once("value");

  if (snapshot.exists()) {
    const game = snapshot.val();
    const lines = await getLinesForGame(league, gameId);
    const away = await getTeam(league.toLowerCase(), game.awayTeamId);
    const home = await getTeam(league.toLowerCase(), game.homeTeamId);
    const gameModel = new Game(game, away, home);
    gameModel.lines = lines;
    return gameModel;
  }
  return {};
}

export async function getGames(
  league,
  {
    fromTimeMillis = Date.now(), // default from now
    toTimeMillis = fromTimeMillis + 24 * 60 * 60 * 1000 // default to a day after fromTimeMillis
  }
) {
  const snapshot = await firebase
    .database()
    .ref(league.toLowerCase())
    .child("games")
    .orderByChild("scheduledTimeUnix")
    .startAt(fromTimeMillis)
    .endAt(toTimeMillis)
    .once("value");

  if (snapshot.hasChildren()) {
    const gamesObj = snapshot.val();
    return Promise.all(
      Object.keys(gamesObj).map(async gameId => {
        const game = gamesObj[gameId];
        const [home, away] = await Promise.all([
          getTeam(league.toLowerCase(), game.homeTeamId),
          getTeam(league.toLowerCase(), game.awayTeamId)
        ]);
        return new Game(game, away, home);
      })
    );
  }
  return [];
}

export async function getGamesWithLines(
  league,
  {
    fromTimeMillis = Date.now(), // default from now
    toTimeMillis = fromTimeMillis + 24 * 60 * 60 * 1000 // default to a day after fromTimeMillis
  }
) {
  const snapshot = await firebase
    .database()
    .ref(league.toLowerCase())
    .child("games")
    .orderByChild("scheduledTimeUnix")
    .startAt(fromTimeMillis)
    .endAt(toTimeMillis)
    .once("value");

  if (snapshot.hasChildren()) {
    const gamesObj = snapshot.val();
    return Promise.all(
      Object.keys(gamesObj).map(async gameId => {
        const gameObj = gamesObj[gameId];
        const [home, away, lines] = await Promise.all([
          getTeam(league.toLowerCase(), gameObj.homeTeamId),
          getTeam(league.toLowerCase(), gameObj.awayTeamId),
          getLinesForGame(league, gameId)
        ]);
        const game = new Game(gameObj, away, home);
        if (lines) game.lines = lines;
        return game;
      })
    ).then(games => games.filter(game => !!game.lines));
  }
  return [];
}

export function getAllGamesFeed(league, fund, callback) {
  const start =
    fund.closedTimeMillis !== -1
      ? fund.closedTimeMillis
      : fund.closingTime * 1000;

  const end =
    fund.returnTimeMillis !== -1
      ? fund.returnTimeMillis
      : moment()
          .add(72, "h")
          .valueOf();

  const ref = firebase
    .database()
    .ref(league)
    .child("games")
    .orderByChild("scheduledTimeUnix")
    .startAt(start)
    .endAt(end);
  return getListFeed(ref, callback);
}

export function placeBet(bet) {
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken => {
      fetch(`${BASE_URL}v1/manager/bet`, {
        method: "post",
        mode: "cors",
        body: JSON.stringify(bet),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      });
    });
}

export function deleteBet(id) {
  if (id) {
    firebase
      .database()
      .ref("wagers")
      .child(id)
      .remove();
  }
}

export const returnFund = fund =>
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken =>
      fetch(`${BASE_URL}v1/manager/return`, {
        method: "post",
        mode: "cors",
        body: JSON.stringify(fund),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: idToken
        }
      })
    )
    .then(response => response.json());

export async function getWager(id) {
  const snapshot = await firebase
    .database()
    .ref("wagers")
    .child(id)
    .once("value");
  return snapshot.exists() ? new Bet(snapshot.val()) : null;
}

export const getFundBets = async fundId => {
  const snapshot = await firebase
    .database()
    .ref("wagers")
    .orderByChild("fundId")
    .equalTo(fundId)
    .once("value");
  if (snapshot.exists()) {
    const betsObj = snapshot.val();
    return Object.keys(betsObj).map(betId => new Bet(betsObj[betId]));
  }
  return [];
};

export async function getManagerStats(
  managerId,
  sinceTimeMillis = 0,
  onlyTraining = false
) {
  let url = `${BASE_URL}v1/profile/manager/${managerId}?onlyTraining=${onlyTraining}`;
  if (sinceTimeMillis) url += `&sinceTimeMillis=${sinceTimeMillis}`;
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(stats => stats.data);
}

export async function getWagersByTime() {
  const snapshot = await firebase
    .database()
    .ref("sessions")
    .orderByChild("serviceType")
    .equalTo("WAGER")
    .once("value");
  return snapshot.val();
}

export function getFundsFeed(managerId, callback) {
  const ref = firebase
    .database()
    .ref("funds")
    .orderByChild("managerId")
    .equalTo(managerId);
  return getListFeed(ref, callback, Fund);
}

export const ManagerAvatarUploadService = avatarFile =>
  new Promise((resolve, reject) => {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        fetch(`${BASE_URL}v1/manager/avatar`, {
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

export const UploadSummaryImage = blobInfo => {
  const uid = getNewUid();
  const { blob, fileName } = blobInfo;
  const ref = firebase
    .storage()
    .ref("summary_photos")
    .child(uid)
    .child(fileName)
    .put(blob);
  return ref;
};
