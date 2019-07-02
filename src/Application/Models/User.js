module.exports = class User {
  constructor(
    {
      approved,
      balance,
      documentStatus,
      email,
      firstTimes = {}, // map of activity (e.g. prediction) to unix-millis-timestamp
      id,
      identityVerified,
      investments,
      joinDate,
      lastNotificationCheck,
      managerId,
      name,
      pin,
      preferences: { receiveBetEmail, receiveReturnEmail },
      publicId,
      returns
    },
    publicUser,
    manager
  ) {
    this.approved = approved;
    this.balance = balance;
    this.documentStatus = documentStatus;
    this.email = email;
    this.firstTimes = firstTimes;
    this.id = id;
    this.identityVerified = identityVerified;
    this.investments = investments;
    this.joinDate = joinDate;
    this.lastNotificationCheck = lastNotificationCheck;
    if (managerId) this.managerId = managerId;
    this.name = name;
    this.pin = pin;
    this.preferences = {
      receiveBetEmail,
      receiveReturnEmail
    };
    this.publicId = publicId;
    this.returns = returns;
    if (publicUser) this.public = publicUser;
    if (manager) this.manager = manager;
  }

  /**
   * @return {boolean} True if this user has wagers that have not been returned
   */
  hasPendingWagers() {
    const wagerCount = this.investments
      ? Object.keys(this.investments).length
      : 0;
    const returnCount = this.returns ? Object.keys(this.returns).length : 0;
    return wagerCount > returnCount;
  }
};
