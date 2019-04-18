module.exports = class Team {
  constructor({ abbr, avatarUrl, color, id, market, name, sportRadarId }) {
    this.abbr = abbr;
    this.avatarUrl = avatarUrl;
    this.color = color;
    this.id = id;
    this.market = market;
    this.name = name;
    this.sportRadarId = sportRadarId;
  }

  /**
   * @return {string} Full team name (market + name)
   */
  fullName() {
    return `${this.market} ${this.name}`;
  }
};
