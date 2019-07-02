module.exports = class Manager {
  constructor(
    { avatarUrl, company, id, joinTimeMillis, name, isTraining },
    details = {}
  ) {
    if (avatarUrl) this.avatarUrl = avatarUrl;
    if (company) this.company = company;
    this.id = id;
    this.joinTimeMillis = joinTimeMillis;
    this.name = name;
    this.details = details;
    this.isTraining = isTraining;
  }
};
