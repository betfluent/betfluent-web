module.exports = class Bet {
  constructor({
    agreeCount = 0,
    createdTimeMillis,
    disagreeCount = 0,
    fundId,
    gameId,
    gameLeague,
    id,
    isTraining,
    liveTimeMillis,
    managerId,
    overUnder,
    pctOfFund, // between 0 and 100
    points,
    reason,
    returned = -1,
    returning,
    returnTimeMillis,
    selection,
    selectionId,
    status,
    type,
    wagered
  }) {
    this.agreeCount = agreeCount;
    this.createdTimeMillis = createdTimeMillis;
    this.disagreeCount = disagreeCount;
    this.id = id;
    if (isTraining) this.isTraining = isTraining;
    this.fundId = fundId;
    this.gameId = gameId;
    this.gameLeague = gameLeague;
    if (liveTimeMillis) this.liveTimeMillis = liveTimeMillis;
    this.managerId = managerId;
    if (overUnder) this.overUnder = overUnder;
    if (pctOfFund) this.pctOfFund = pctOfFund;
    if (points) this.points = points;
    if (reason) this.reason = reason;
    this.returned = returned;
    this.returning = returning;
    if (returnTimeMillis) this.returnTimeMillis = returnTimeMillis;
    if (selection) this.selection = selection;
    if (selectionId) this.selectionId = selectionId;
    this.status = status;
    this.type = type;
    if (wagered) this.wagered = wagered;
  }

  /**
   * @return {number} Total amount in cents that this bet will return if it wins.
   */
  toWin() {
    let toWn;
    if (this.returning < 0) {
      toWn = this.wagered * 100 / Math.abs(this.returning);
    } else toWn = this.wagered * this.returning / 100;
    return Math.floor(toWn) + this.wagered;
  }

  /**
   * @param {Object} game the game that the bet outcome depends on. Not necessary if the bet is returned.
   * @return {number} Amount in cents that will be returned based on the wagered amount, the odds, and the score of the game.
   * This includes the stake and winnings upon a win, just the stake upon a push, and 0 cents upon a lose.
   */
  resultAmount(game) {
    if (this.returned !== -1) return this.returned;
    if (typeof game === "undefined") return undefined;

    const awayScore = game.awayTeamScore || 0;
    const homeScore = game.homeTeamScore || 0;
    const spread = homeScore - awayScore;

    if (this.type === "OVER_UNDER") {
      if (awayScore + homeScore === this.points) {
        return this.wagered;
      } else if (this.overUnder.toLowerCase() === "over") {
        if (awayScore + homeScore > this.points) {
          return this.toWin();
        }
        return 0;
      } else if (awayScore + homeScore < this.points) {
        return this.toWin();
      }
      return 0;
    }
    if (this.type === "MONEYLINE") {
      if (this.selection.indexOf(game.awayTeamName) !== -1) {
        if (spread < 0) {
          return this.toWin();
        } else if (spread > 0) {
          return 0;
        }
        return this.wagered;
      } else if (spread > 0) {
        return this.toWin();
      } else if (spread < 0) {
        return 0;
      }
      return this.wagered;
    }
    if (this.type === "SPREAD") {
      if (this.selection.indexOf(game.awayTeamName) !== -1) {
        if (spread < this.points) {
          return this.toWin();
        } else if (spread > this.points) {
          return 0;
        }
        return this.wagered;
      } else if (spread > -this.points) {
        return this.toWin();
      } else if (spread < -this.points) {
        return 0;
      }
      return this.wagered;
    }
    return undefined; // Prop bet results cannot be calculated with available info
  }

  /**
   * @param {Object} game the game that the bet outcome depends on. Not necessary if the bet is returned.
   * @return {number} Amount in cents either lost (-negative) or won (+positive) based on the wagered
   * amount, the odds, and the score of the game. This amount is 0 cents upon a push.
   */
  relativeResultAmount(game) {
    const resultAmount = this.resultAmount(game);
    if (typeof resultAmount === "undefined") return undefined;
    return resultAmount - this.wagered;
  }

  /**
   * @return {string} The technical summary of the bet (e.g. "New York Knicks -5 (-110)")
   */
  summary() {
    if (this.type === "PROP") return "Prop bet";
    let betSummary = "";
    if (this.type !== "OVER_UNDER") {
      betSummary += `${this.selection} `;
    }
    if (this.type === "SPREAD" && this.points > 0) {
      betSummary += "+";
    }
    if (this.type !== "MONEYLINE") {
      betSummary += `${this.points} `;
    }
    betSummary += "(";
    if (this.returning > 0) {
      betSummary += "+";
    }
    betSummary += this.returning;
    betSummary += ")";
    if (this.type === "OVER_UNDER") {
      betSummary += `${this.overUnder.toLowerCase().substring(0, 1)} `;
    }
    return betSummary;
  }

  /**
   * @return {string} The plain-english explanation of the bet (e.g. "New York Knicks must win by 6 or more.")
   */
  explanation() {
    if (this.type === "PROP") return this.reason;
    let betDescription = "";
    if (this.type === "OVER_UNDER") {
      let points;
      if (this.overUnder.toLowerCase() === "over")
        points = Math.floor(this.points);
      else points = Math.ceil(this.points);
      betDescription += `The combined score of both teams must be ${this.overUnder.toLowerCase()} ${points}.`;
    }
    if (this.type === "MONEYLINE") {
      betDescription += `${this.selection} must win.`;
    }
    if (this.type === "SPREAD" && this.points > 0) {
      betDescription +=
        `${this.selection} must win outright ` +
        `or lose by less than ${Math.ceil(this.points)}.`;
    }
    if (this.type === "SPREAD" && this.points < 0) {
      betDescription +=
        `${this.selection} must win by ` +
        `at least ${Math.floor(Math.abs(this.points)) + 1}.`;
    }
    return betDescription;
  }
};
