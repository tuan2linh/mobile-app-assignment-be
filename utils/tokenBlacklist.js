class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Set();
  }

  add(token) {
    this.blacklistedTokens.add(token);
  }

  has(token) {
    return this.blacklistedTokens.has(token);
  }
}

module.exports = new TokenBlacklist();
