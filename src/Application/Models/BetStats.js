const baseStats = () => ({
  currentStreak: 0,
  longestStreak: 0,
  loseAmount: 0,
  loseCount: 0,
  placedAmount: 0,
  placedCount: 0,
  pushAmount: 0,
  pushCount: 0,
  winAmount: 0,
  winCount: 0
});

module.exports = class BetStats {
  constructor({
    currentStreak = 0,
    leagues = {}, // map of leagueName to league-betStats
    longestStreak = 0,
    loseAmount = 0, // a negative number
    loseCount = 0,
    moneyline = baseStats(),
    overUnder = baseStats(),
    placedAmount = 0,
    placedCount = 0,
    pushAmount = 0,
    pushCount = 0,
    spread = baseStats(),
    userId,
    week,
    winAmount = 0, // only profits
    winCount = 0
  }) {
    this.currentStreak = currentStreak;
    this.leagues = leagues;
    this.longestStreak = longestStreak;
    this.loseAmount = loseAmount;
    this.loseCount = loseCount;
    this.moneyline = moneyline;
    this.overUnder = overUnder;
    this.placedAmount = placedAmount;
    this.placedCount = placedCount;
    this.pushAmount = pushAmount;
    this.pushCount = pushCount;
    this.spread = spread;
    this.userId = userId;
    this.week = week;
    this.winAmount = winAmount;
    this.winCount = winCount;
  }
};
