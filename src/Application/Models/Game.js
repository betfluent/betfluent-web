module.exports = class Game {
  constructor(
    {
      id,
      sportRadarId,
      description,
      league,
      status,
      scheduledTimeUnix,
      startTimeMillis,
      completedTimeMillis,
      awayTeamId,
      awayTeamName,
      awayTeamAlias,
      homeTeamId,
      homeTeamName,
      homeTeamAlias,
      awayTeamScore,
      awayScoring,
      homeTeamScore,
      homeScoring,
      broadcastNetwork,
      clock,
      period,
      possession,
      // MLB-specific fields
      count: { balls, strikes, outs } = {},
      bases: { first, second, third } = {},
      awayTeamHits = 0,
      awayTeamErrors = 0,
      homeTeamHits = 0,
      homeTeamErrors = 0,
      pitcher,
      // Football-specific fields
      situation: {
        ballLocation,
        ballYardLine,
        down,
        possession: situatonPossession,
        yfd
      } = {}
    },
    awayTeam,
    homeTeam
  ) {
    this.id = id;
    this.sportRadarId = sportRadarId;
    this.description = description;
    this.league = league;
    this.status = status;
    this.scheduledTimeUnix = scheduledTimeUnix;
    if (startTimeMillis) this.startTimeMillis = startTimeMillis;
    if (completedTimeMillis) this.completedTimeMillis = completedTimeMillis;
    if (awayTeam) this.awayTeam = awayTeam;
    this.awayTeamId = awayTeamId;
    this.awayTeamName = awayTeamName;
    this.awayTeamAlias = awayTeamAlias;
    if (homeTeam) this.homeTeam = homeTeam;
    this.homeTeamId = homeTeamId;
    this.homeTeamName = homeTeamName;
    this.homeTeamAlias = homeTeamAlias;
    this.awayTeamScore = awayTeamScore;
    this.awayScoring = awayScoring;
    this.homeTeamScore = homeTeamScore;
    this.homeScoring = homeScoring;
    this.broadcastNetwork = broadcastNetwork;
    if (clock) this.clock = clock;
    this.period = period;
    if (possession) this.possession = possession;
    if (league === "MLB") {
      if (balls !== undefined) this.count = { balls, strikes, outs };
      if (first !== undefined) this.bases = { first, second, third };
      if (awayTeamHits !== undefined) this.awayTeamHits = awayTeamHits;
      if (awayTeamErrors !== undefined) this.awayTeamErrors = awayTeamErrors;
      if (homeTeamHits !== undefined) this.homeTeamHits = homeTeamHits;
      if (homeTeamErrors !== undefined) this.homeTeamErrors = homeTeamErrors;
      if (pitcher) this.pitcher = pitcher;
    }
    if (league === "NFL" || league === "NCAAF") {
      this.situation = {
        down,
        ballLocation,
        ballYardLine,
        possession: situatonPossession,
        yfd
      };
    }
  }

  situationSummary() {
    if ((this.league === "NFL" || this.league === "NCAAF") && this.situation) {
      let downSuffix;
      switch (this.situation.down) {
        case 1:
          downSuffix = "st";
          break;
        case 2:
          downSuffix = "nd";
          break;
        case 3:
          downSuffix = "rd";
          break;
        case 4:
          downSuffix = "th";
          break;
        default:
          return "";
      }
      return `${this.situation.down}${downSuffix} and ${
        this.situation.yfd
      } - ball on ${this.situation.ballLocation} ${
        this.situation.ballYardLine
      }`;
    }
    return "";
  }
};
