module.exports = class PublicUser {
  constructor({ avatarUrl, id, joinTimeMillis, name }, predictionStats) {
    if (avatarUrl) this.avatarUrl = avatarUrl;
    this.id = id;
    this.joinTimeMillis = joinTimeMillis;
    this.name = name;
    if (predictionStats) this.predictionStats = predictionStats;
  }
};
