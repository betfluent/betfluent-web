import firebase from "../../firebase";
import User from "../Models/User";
import PublicUser from "../Models/PublicUser";
import Manager from "../Models/Manager";
import Fund from "../Models/Fund";
import Bet from "../Models/Bet";
import Team from "../Models/Team";
import Game from "../Models/Game";
import PredictionStats from "../Models/PredictionStats";

function getFeed(ref, callback, Model) {
  const feed = ref.on("value", snapshot => {
    if (snapshot.exists()) {
      if (Model) callback(new Model(snapshot.val()));
      else callback(snapshot.val());
    } else callback(null);
  });
  return { off: () => ref.off("value", feed) };
}

function getListFeed(ref, callback, Model) {
  const feed = ref.on("value", snapshot => {
    if (snapshot.exists() && snapshot.hasChildren()) {
      const objMap = snapshot.val();
      const arr = Model
        ? Object.keys(objMap).map(key => new Model(objMap[key]))
        : Object.keys(objMap).map(key => objMap[key]);
      callback(arr);
    } else callback([]);
  });
  return { off: () => ref.off("value", feed) };
}

function getContestWeek(timeMillis) {
  const ONE_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;
  const millisSinceStart = timeMillis - 1528700400000; // Monday June 11th 12:00am PT
  return Math.floor(millisSinceStart / ONE_WEEK_MILLIS).toLocaleString(
    undefined,
    { minimumIntegerDigits: 3 }
  );
}

export function getNewUid() {
  return firebase
    .database()
    .ref()
    .push().key;
}

export async function getPublicUserBtbStats(publicUserId) {
  const snapshot = await firebase
    .database()
    .ref("public/beatTheBettor")
    .orderByChild("userId")
    .equalTo(publicUserId)
    .once("value");
  if (snapshot.exists() && snapshot.hasChildren()) {
    const statsObj = snapshot.val();
    return Object.keys(statsObj).map(key => new PredictionStats(statsObj[key]));
  }
  return [];
}

export function getPublicUserBtbStatsFeed(publicUserId, callback) {
  const ref = firebase
    .database()
    .ref("public/beatTheBettor")
    .orderByChild("userId")
    .equalTo(publicUserId);
  return getListFeed(ref, callback, PredictionStats);
}

export async function getManager(managerId) {
  const snapshot = await firebase
    .database()
    .ref("managers")
    .child(managerId)
    .once("value");
  return snapshot.exists() ? new Manager(snapshot.val()) : null;
}

export function getManagerFeed(managerId, callback) {
  const ref = firebase
    .database()
    .ref("managers")
    .child(managerId);
  return getFeed(ref, callback, Manager);
}

export async function getManagerDetail(managerId) {
  const snapshotPromise = firebase
    .database()
    .ref("managers")
    .child(managerId)
    .once("value");
  const detailPromise = firebase
    .database()
    .ref("managerDetails")
    .child(managerId)
    .once("value");
  const [snapshot, detailSnapshot] = await Promise.all([
    snapshotPromise,
    detailPromise
  ]);
  return snapshot.exists()
    ? new Manager(snapshot.val(), detailSnapshot.val())
    : null;
}

export function getManagerDetailFeed(managerId, callback) {
  let manager;
  let managerDetail;
  const fireCallback = () => {
    if (manager && managerDetail !== undefined) {
      manager.details = managerDetail;
      callback(manager);
    }
  };
  const managerFeed = getManagerFeed(managerId, managerObj => {
    manager = managerObj;
    fireCallback();
  });
  const detailRef = firebase
    .database()
    .ref("managerDetails")
    .child(managerId);
  const detailFeed = getFeed(detailRef, detailObj => {
    managerDetail = detailObj;
    fireCallback();
  });
  return {
    off: () => {
      managerFeed.off();
      detailFeed.off();
    }
  };
}

export function updateManager(managerId, updates) {
  if (typeof managerId !== "string" || managerId.length === 0) {
    return Promise.reject(new Error("managerId must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("managers")
    .child(managerId)
    .update(updates);
}

export function updateManagerDetails(managerId, updates) {
  if (typeof managerId !== "string" || managerId.length === 0) {
    return Promise.reject(new Error("managerId must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("managerDetails")
    .child(managerId)
    .update(updates);
}

export async function getPublicUser(publicUserId) {
  const snapshot = await firebase
    .database()
    .ref("public/users")
    .child(publicUserId)
    .once("value");
  return snapshot.exists() ? new PublicUser(snapshot.val()) : null;
}

export function getPublicUserFeed(publicUserId, callback) {
  const ref = firebase
    .database()
    .ref("public/users")
    .child(publicUserId);
  return getFeed(ref, callback, PublicUser);
}

export async function getPublicUserDetail(publicUserId) {
  const [publicUser, predictionStats] = await Promise.all([
    getPublicUser(publicUserId),
    getPublicUserBtbStats(publicUserId)
  ]);
  if (publicUser) {
    publicUser.predictionStats = predictionStats;
  }
  return publicUser;
}

export function getPublicUserDetailFeed(publicUserId, callback) {
  let publicUser;
  let predictionStats;
  const fireCallback = () => {
    if (publicUser && predictionStats) {
      publicUser.predictionStats = predictionStats;
      callback(publicUser);
    }
  };
  const publicUserFeed = getPublicUserFeed(publicUserId, pUser => {
    publicUser = pUser;
    fireCallback();
  });
  const predictionStatsFeed = getPublicUserBtbStatsFeed(
    publicUserId,
    pStats => {
      predictionStats = pStats;
      fireCallback();
    }
  );
  return {
    off: () => {
      publicUserFeed.off();
      predictionStatsFeed.off();
    }
  };
}

export function getAllPublicUsersFeed(callback) {
  const ref = firebase.database().ref("public/users");
  return getListFeed(ref, callback, PublicUser);
}

export function setPublicUser(publicUser) {
  if (
    !publicUser ||
    typeof publicUser.id !== "string" ||
    publicUser.id.trim().length === 0
  ) {
    return Promise.reject(
      new Error("publicUser.id must be a non-blank string")
    );
  }
  return firebase
    .database()
    .ref("public/users")
    .child(publicUser.id)
    .set(publicUser);
}

export function getAllPublicUserBtbStatsForWeekFeed(timeMillis, callback) {
  const middleWare = predictionStats => {
    const publicUsers = [];
    predictionStats.forEach((stat, index) => {
      getPublicUser(stat.userId).then(publicUser => {
        publicUser.predictionStats = [stat]; // eslint-disable-line no-param-reassign
        publicUsers.splice(index, 0, publicUser);
        if (publicUsers.length === predictionStats.length) {
          callback(publicUsers);
        }
      });
    });
  };
  const currentWeek = getContestWeek(timeMillis);
  const ref = firebase
    .database()
    .ref("public/beatTheBettor")
    .orderByChild("week")
    .equalTo(currentWeek);
  return getListFeed(ref, middleWare, PredictionStats);
}

export async function getUser(userId) {
  const snapshot = await firebase
    .database()
    .ref("users")
    .child(userId)
    .once("value");
  if (snapshot.exists()) {
    const user = snapshot.val();
    if (user.managerId) {
      const [publicUser, manager] = await Promise.all([
        getPublicUserDetail(user.publicId),
        getManagerDetail(user.managerId)
      ]);
      return new User(user, publicUser, manager);
    }
    const publicUser = await getPublicUser(user.publicId);
    return new User(user, publicUser);
  }
  return null;
}

export function getUserFeed(userId, callback) {
  let publicFeed;
  let managerFeed;
  const wrapper = user => {
    if (user) {
      let publicUser;
      let manager;
      const fireCallback = () => {
        if (user && publicUser && (user.managerId ? manager : true)) {
          callback(new User(user, publicUser, manager));
        }
      };
      if (user.managerId) {
        if (managerFeed && managerFeed.off) managerFeed.off();
        managerFeed = getManagerDetailFeed(user.managerId, managerObj => {
          manager = managerObj;
          fireCallback();
        });
      }
      if (publicFeed) publicFeed.off();
      publicFeed = getPublicUserDetailFeed(user.publicId, publicUserObj => {
        publicUser = publicUserObj;
        fireCallback();
      });
    }
  };

  const ref = firebase
    .database()
    .ref("users")
    .child(userId);
  const feed = getFeed(ref, wrapper);
  return {
    off: () => {
      feed.off();
      if (publicFeed) publicFeed.off();
      if (managerFeed) managerFeed.off();
    }
  };
}

export function setUser(user) {
  if (!user || typeof user.id !== "string" || user.id.trim().length === 0) {
    return Promise.reject(new Error("user.id must be a non-blank string"));
  }
  if (user.public) {
    /* eslint-disable no-param-reassign */
    user = Object.assign({}, user);
    delete user.public;
    /* eslint-enable no-param-reassign */
  }
  return firebase
    .database()
    .ref("users")
    .child(user.id)
    .set(user);
}

export async function getUserIdentity(userId) {
  const snapshot = await firebase
    .database()
    .ref("userIdentities")
    .child(userId)
    .once("value");
  return snapshot.val();
}

export function setUserIdentity(userIdentity) {
  if (
    !userIdentity ||
    typeof userIdentity.id !== "string" ||
    userIdentity.id.trim().length === 0
  ) {
    return Promise.reject(
      new Error("userIdentity.id must be a non-blank string")
    );
  }
  return firebase
    .database()
    .ref("userIdentities")
    .child(userIdentity.id)
    .set(userIdentity);
}

export function getUserPredictionsFeed(publicUserId, callback) {
  const ref = firebase
    .database()
    .ref("predictions")
    .child(publicUserId);
  return getListFeed(ref, callback);
}

export function getUserPredictionFeed(publicUserId, betId, callback) {
  const ref = firebase
    .database()
    .ref("predictions")
    .child(publicUserId)
    .child(betId);
  return getFeed(ref, callback);
}

export async function updatePublicUser(publicUserId, updates) {
  if (typeof publicUserId !== "string" || publicUserId.length === 0) {
    return Promise.reject(new Error("publicUserId must be a non-blank string"));
  }

  if (updates.name) {
    const namesSnapshot = await firebase
      .database()
      .ref("public/users")
      .orderByChild("name")
      .equalTo(updates.name)
      .once("value");
    if (namesSnapshot.exists() && namesSnapshot.hasChildren()) {
      throw new Error(`Username ${updates.name} already exists.`);
    }
  }

  return firebase
    .database()
    .ref("public/users")
    .child(publicUserId)
    .update(updates);
}

export function updateUserNotificationView(user) {
  if (!user || typeof user.id !== "string" || user.id.trim().length === 0) {
    return Promise.reject(new Error("user.id must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("users")
    .child(user.id)
    .update({ lastNotificationCheck: new Date().getTime() });
}

export function setUserPin(user, pin) {
  if (!user || typeof user.id !== "string" || user.id.trim().length === 0) {
    return Promise.reject(new Error("user.id must be a non-blank string"));
  }
  if (typeof pin !== "string" || pin.trim().length === 0) {
    return Promise.reject(new Error("pin must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("users")
    .child(user.id)
    .update({ pin });
}

export function resetUserPin(user, pin) {
  if (!user || typeof user.id !== "string" || user.id.trim().length === 0) {
    return Promise.reject(new Error("user.id must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("users")
    .child(user.id)
    .update({ pin });
}

export function setSportsPreferences(userId, sportsArr) {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    return Promise.reject(new Error("userId must be a non-blank string"));
  }
  if (typeof sportsArr !== "object" || !(sportsArr.length > 0)) {
    return Promise.reject(new Error("sportsArr must be a non-blank array"));
  }
  const sports = sportsArr.reduce((obj, sport) => {
    obj[sport] = true; // eslint-disable-line no-param-reassign
    return obj;
  }, {});
  return firebase
    .database()
    .ref("users")
    .child(userId)
    .child("preferences")
    .update({ sports });
}

export function setPreferences(user, preferences) {
  if (!user || typeof user.id !== "string" || user.id.trim().length === 0) {
    return Promise.reject(new Error("user.id must be a non-blank string"));
  }
  if (typeof preferences !== "object") {
    return Promise.reject(new Error("preferences must be an object"));
  }
  return firebase
    .database()
    .ref("users")
    .child(user.id)
    .update({ preferences });
}

export async function getTeam(league, teamId) {
  const snapshot = await firebase
    .database()
    .ref(league.toLowerCase())
    .child("teams")
    .child(teamId)
    .once("value");
  return snapshot.exists() ? new Team(snapshot.val()) : null;
}

export function getTeamFeed(league, teamId, callback) {
  const ref = firebase
    .database()
    .ref(league.toLowerCase())
    .child("teams")
    .child(teamId);
  return getFeed(ref, callback, Team);
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
    const [awayTeam, homeTeam] = await Promise.all([
      getTeam(league, game.awayTeamId),
      getTeam(league, game.homeTeamId)
    ]);
    return new Game(game, awayTeam, homeTeam);
  }
  return null;
}

export function getGameFeed(league, gameId, callback) {
  let awayTeam;
  let homeTeam;
  const teamWrapper = async game => {
    if (game) {
      if (awayTeam && homeTeam) {
        /* eslint-disable no-param-reassign */
        game.awayTeam = awayTeam;
        game.homeTeam = homeTeam;
      } else {
        [awayTeam, homeTeam] = await Promise.all([
          getTeam(league, game.awayTeamId),
          getTeam(league, game.homeTeamId)
        ]);
        game.awayTeam = awayTeam;
        game.homeTeam = homeTeam;
        /* eslint-enable no-param-reassign */
      }
    }
    callback(game);
  };
  const ref = firebase
    .database()
    .ref(league.toLowerCase())
    .child("games")
    .child(gameId);
  return getFeed(ref, teamWrapper, Game);
}

export function getGamePlayByPlayFeed(league, id, callback) {
  const ref = firebase
    .database()
    .ref(league.toLowerCase())
    .child("pbp")
    .orderByChild("gameId")
    .equalTo(id);
  return getListFeed(ref, callback);
}

export function getLatestPlayByPlayFeed(league, id, callback) {
  const middleWare = playByPlays => {
    const latest = playByPlays
      .sort((pbp1, pbp2) => pbp1.sequence - pbp2.sequence)
      .pop();
    callback(latest);
  };
  return getGamePlayByPlayFeed(league, id, middleWare);
}

export async function getFund(fundId) {
  const snapshot = await firebase
    .database()
    .ref("funds")
    .child(fundId)
    .once("value");
  if (snapshot.exists()) {
    const fund = snapshot.val();
    const manager = await getManager(fund.managerId);
    return new Fund(fund, manager);
  }
  return null;
}

export function getFundFeed(fundId, callback) {
  let manager;
  const middleWare = fund => {
    if (fund) {
      if (manager) {
        fund.manager = manager; // eslint-disable-line no-param-reassign
        callback(fund);
      } else {
        getManager(fund.managerId).then(managerObj => {
          manager = managerObj;
          fund.manager = manager; // eslint-disable-line no-param-reassign
          callback(fund);
        });
      }
    }
  };
  const ref = firebase
    .database()
    .ref("funds")
    .child(fundId);
  return getFeed(ref, middleWare, Fund);
}

/** @returns {object} The FundDetails object (not the base fund) */
export async function getFundDetails(fundId) {
  const snapshot = await firebase
    .database()
    .ref("fundDetails")
    .child(fundId)
    .once("value");
  if (snapshot.exists()) {
    const fundDetails = snapshot.val();
    if (fundDetails.potentialGames) {
      const potentialGames = await Promise.all(
        Object.keys(fundDetails.potentialGames).map(gameId => {
          const league = fundDetails.potentialGames[gameId];
          return getGame(league, gameId);
        })
      );
      fundDetails.potentialGames = potentialGames;
    }
    return fundDetails;
  }
  return null;
}

/** @returns {object} The Fund object with the details loaded as well */
export async function getFundWithDetails(fundId) {
  const [fund, details] = await Promise.all([
    getFund(fundId),
    getFundDetails(fundId)
  ]);
  fund.details = details;
  return fund;
}

export function getOpenFundsFeed(callback) {
  const middleWare = fundModels => {
    if (fundModels.length === 0) {
      callback(fundModels);
    } else {
      const funds = [];
      fundModels.forEach((fund, index) => {
        getManager(fund.managerId).then(manager => {
          fund.manager = manager; // eslint-disable-line no-param-reassign
          funds.splice(index, 0, fund);
          if (funds.length === fundModels.length) {
            callback(funds);
          }
        });
      });
    }
  };
  const ref = firebase
    .database()
    .ref("funds")
    .orderByChild("status")
    .equalTo("OPEN");
  return getListFeed(ref, middleWare, Fund);
}

export function getUserInteractionsFeed(userId, publicUserId, callback) {
  const baseRef = firebase.database().ref("interactions");
  const userRef = baseRef.orderByChild("userId").equalTo(userId);
  const publicRef = baseRef.orderByChild("userId").equalTo(publicUserId);
  const interactionMap = { user: [], public: [] };
  const fireCallback = () => {
    const interactions = interactionMap.user
      .concat(interactionMap.public)
      .sort((a, b) => a.time - b.time);
    if (interactions.length > 0) callback(interactions);
  };
  const userFeed = getListFeed(userRef, userInteractions => {
    interactionMap.user = userInteractions;
    fireCallback();
  });
  const publicFeed = getListFeed(publicRef, publicInteractions => {
    interactionMap.public = publicInteractions;
    fireCallback();
  });
  return {
    off: () => {
      userFeed.off();
      publicFeed.off();
    }
  };
}

export function getFundInteractionsFeed(fundId, callback) {
  const ref = firebase
    .database()
    .ref("interactions")
    .orderByChild("fundId")
    .equalTo(fundId);
  return getListFeed(ref, callback);
}

export function getUserInteractionsCount(userId, callback) {
  const fundInteractionsMap = {};
  let user;
  let userInteractions;
  let fundInteractionsFeeds;

  const getNewCount = interactionArray =>
    interactionArray.filter(
      interaction => interaction.time > (user.lastNotificationCheck || 0)
    ).length;

  const fireCallback = () => {
    if (user && userInteractions) {
      const userWagerCount = user.investments
        ? Object.keys(user.investments).length
        : 0;
      const fundsLoadedCount = Object.keys(fundInteractionsMap).length;
      if (userWagerCount === fundsLoadedCount) {
        const fundInteractions = Object.keys(fundInteractionsMap).reduce(
          (all, fundId) => all.concat(fundInteractionsMap[fundId]),
          []
        );
        callback(getNewCount(fundInteractions) + getNewCount(userInteractions));
      }
    }
  };

  const userFeed = getUserFeed(userId, u => {
    user = u;
    if (!user || !user.investments) fireCallback();
    else {
      if (fundInteractionsFeeds)
        fundInteractionsFeeds.forEach(feed => feed.off());

      fundInteractionsFeeds = Object.keys(user.investments).map(fundId =>
        getFundInteractionsFeed(fundId, interactions => {
          const relevantInteractions = interactions.filter(
            interaction => interaction.type !== "Wager"
          );
          fundInteractionsMap[fundId] = relevantInteractions;
          fireCallback();
        })
      );
    }
  });

  const userInteractionsFeed =
    user &&
    getUserInteractionsFeed(user.id, user.publicId, uInteractions => {
      userInteractions = uInteractions.filter(
        interaction => interaction.type.indexOf("DOCUMENT") !== -1
      );
      fireCallback();
    });

  return {
    off: () => {
      if (userFeed) userFeed.off();
      if (userInteractionsFeed) userInteractionsFeed.off();
      if (fundInteractionsFeeds)
        fundInteractionsFeeds.forEach(feed => feed.off());
    }
  };
}

export async function getBet(betId) {
  const snapshot = await firebase
    .database()
    .ref("wagers")
    .child(betId)
    .once("value");
  return snapshot.exists() ? new Bet(snapshot.val()) : null;
}

export function getBetFeed(betId, callback) {
  const ref = firebase
    .database()
    .ref("wagers")
    .child(betId);
  return getFeed(ref, callback, Bet);
}

export async function getBets(betIds) {
  const queries = [];
  betIds.forEach(betId => {
    queries.push(getBet(betId));
  });
  return Promise.all(queries);
}

export function setFcmToken(userId, token) {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    return Promise.reject(new Error("userId must be a non-blank string"));
  }
  if (typeof token !== "string" || token.trim().length === 0) {
    return Promise.reject(new Error("token must be a non-blank string"));
  }
  return firebase
    .database()
    .ref("fcm_tokens")
    .child(userId)
    .child("web")
    .set(token);
}

export function getCommentsFeed(fundId, callback) {
  const ref = firebase
    .database()
    .ref("fundDetails")
    .child(fundId)
    .child("comments");
  return getListFeed(ref, callback);
}

export function uploadComment({
  publicUserId,
  fundId,
  comment,
  isManager = null
}) {
  const ref = firebase
    .database()
    .ref("fundDetails")
    .child(fundId)
    .child("comments")
    .push();
  const id = ref.key;
  const createdTimeMillis = firebase.database.ServerValue.TIMESTAMP;
  ref.set({ publicUserId, comment, createdTimeMillis, id, isManager });
}
