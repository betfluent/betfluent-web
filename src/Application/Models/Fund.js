module.exports = class Fund {
  constructor(
    {
      amountReturned = -1,
      amountWagered = 0,
      balance,
      closedTimeMillis,
      closingTime,
      createdTimeMillis,
      games,
      id,
      isTraining,
      league,
      managerId,
      maxBalance,
      maxInvestment,
      minInvestment,
      name,
      open,
      openTimeMillis,
      pctOfFeeCommission,
      percentFee = 0,
      playerCount = 0,
      results,
      returnCount = 0,
      returnTimeMillis,
      sport,
      status,
      type,
      wagers
    },
    manager
  ) {
    this.amountReturned = amountReturned;
    this.amountWagered = amountWagered;
    this.balance = balance;
    this.closedTimeMillis = closedTimeMillis;
    this.closingTime = closingTime;
    this.createdTimeMillis = createdTimeMillis;
    this.games = games;
    this.id = id;
    if (isTraining) this.isTraining = isTraining;
    this.league = league;
    if (manager) this.manager = manager;
    this.managerId = managerId;
    this.maxBalance = maxBalance;
    this.maxInvestment = maxInvestment;
    this.minInvestment = minInvestment;
    this.name = name;
    this.open = open;
    this.openTimeMillis = openTimeMillis;
    this.pctOfFeeCommission = pctOfFeeCommission;
    this.percentFee = percentFee;
    this.playerCount = playerCount;
    this.results = results;
    this.returnCount = returnCount;
    this.returnTimeMillis = returnTimeMillis;
    this.sport = sport;
    this.status = status;
    this.type = type;
    this.wagers = wagers;
  }

  /**
   * @return {boolean} True if there are bets that have not completed
   */
  hasPendingBets() {
    const betCount = this.wagers ? Object.keys(this.wagers).length : 0;
    const resultCount = this.results ? Object.keys(this.results).length : 0;
    return betCount !== resultCount;
  }

  /**
   * @return {number} Amount in cents at stake on pending bets
   */
  atStake() {
    const resultBetIds = this.results ? Object.keys(this.results) : [];
    return this.wagers
      ? Object.keys(this.wagers)
          .filter(betId => !resultBetIds.includes(betId))
          .reduce((total, betId) => total + this.wagers[betId], 0)
      : 0;
  }

  /**
   * @return {number} Absolute value of fund in cents
   */
  absValue() {
    return this.balance + this.atStake() + this.amountReturned;
  }

  /**
   * @return {number} Amount in cents withheld for fees before user returns are calculated.
   */
  amountFee() {
    const value = this.absValue();
    if (value <= this.amountWagered) {
      return 0;
    }
    return Math.floor((value - this.amountWagered) * this.percentFee / 100);
  }

  /**
   * @return {number} Amount in cents that will be allocated to Manager upon fund return
   */
  managerReturn() {
    return Math.floor(this.amountFee() * this.pctOfFeeCommission / 100);
  }

  /**
   * @param {number} userWager the amount in cents wagered by the User
   * @return {number} Amount in cents that will be allocated to the User upon fund return
   */
  userReturn(userWager) {
    const value = this.absValue();
    if (value === 0) return 0;
    if (value === this.amountWagered) return userWager;
    const totalReturn = value - this.amountFee();
    return Math.floor(totalReturn * userWager / this.amountWagered);
  }
};
