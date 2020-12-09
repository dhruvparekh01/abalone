/**
 * Robert's heuristic
 * @param {Array} state state matrix
 * @param {string} colour of the MAX Player: "b" || "w"
 */
export const robertHeuristic = (state, colour) => {
  // Get numerical value of players
  let maxPlayer;
  let minPlayer;
  if (colour === 'w') {
    maxPlayer = 2;
    minPlayer = 3;
  } else {
    maxPlayer = 3;
    minPlayer = 2;
  }

  // Use fixed length array instead of array.push to boost speed
  // 14 is maximum number of marbles for one player
  let lenMax = 0;
  let lenMin = 0;
  const posMax = new Array(14);
  const posMin = new Array(14);

  // Total manhattan distances to center
  let manDisMax = 0;
  let manDisMin = 0;

  // Use constant 9 instead of using state.length to boost speed
  for (let row = 0; row < 9; row++) {
    const values = state[row];
    for (let col = 0; col < 9; col++) {
      // Calculate manhattan distance to center
      const type = values[col];
      const manDis = Math.abs(row - 4) + Math.abs(col - 4);
      if (type === maxPlayer) {
        posMax[lenMax++] = [row, col];
        manDisMax += manDis;
      } else if (type === minPlayer) {
        posMin[lenMin++] = [row, col];
        manDisMin += manDis;
      }
    }
  }

  // Difference between mean manhattan distance of MIN and MAX player
  // diffMeanManDis > 0: MAX is closer to center than MIN
  // diffMeanManDis < 0: MIN is closer to center than MAX
  const diffMeanManDis = manDisMin / lenMin - manDisMax / lenMax;

  // If the the means manhattan distances of both players are similar,
  // i.e. the above diff is less than a threshold, take into account number of
  // marbles as a bonus.
  let bonus = 0;
  if (Math.abs(diffMeanManDis) < 2) {
    // Scale number by 10 to make this criterion more important than mean distance
    // bonus > 0: MAX has more marbles than MIN
    // bonus < 0: MIN has more marbles than MAX
    bonus = (lenMax - lenMin) * 10;
  }

  return diffMeanManDis + bonus;
}
