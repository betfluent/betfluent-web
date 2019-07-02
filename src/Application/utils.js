export function betsPercentChange(bets) {
  let totalWager = 0;
  let totalReturn = 0;
  bets.forEach(bet => {
    totalWager += bet.wagered;
    totalReturn += bet.returned;
  });
  return ((totalReturn - totalWager) / totalWager * 100).toFixed(2);
}
