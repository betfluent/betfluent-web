module.exports = class PredictionStats {
  constructor({
    currentStreak = 0,
    leagues = {}, // map of leagueNames to league-predictionStats
    longestStreak = 0,
    points = 0,
    predictionCount = 0,
    pushCount = 0,
    rightCount = 0,
    userId,
    week,
    wrongCount = 0
  }) {
    this.currentStreak = currentStreak;
    this.leagues = leagues;
    this.longestStreak = longestStreak;
    this.points = points;
    this.predictionCount = predictionCount;
    this.pushCount = pushCount;
    this.rightCount = rightCount;
    this.userId = userId;
    this.week = week;
    this.wrongCount = wrongCount;
  }
};
