import { colourValLetterToNum } from './stateHelpers'

/**
 * Assigns a heuristic value to a state. If a move results in more marbles on the board and/or more marbles in
 * the centre of the board for min, lower the total & vice versa for max
 * @param {Array} state state matrix
 * @param {string} maxPlayer b || w
 */
export const emilyHeuristic = (state, maxPlayer) => {
  const distanceValues = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 3, 4, 3, 2, 1, 0],
      [0, 1, 2, 3, 3, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  let total = 0

  const maxColour = colourValLetterToNum[maxPlayer]
  const minColour = maxColour === 3 ? 2 : 3

  let minCount = 0
  let maxCount = 0

  state.forEach((row, rowIndex) => {
      row.forEach((space, colIndex) => {
          if (space === minColour) {
              minCount++
              total -= 50
              total -= distanceValues[rowIndex][colIndex]
          } else if (space === maxColour) {
              maxCount++
              total += 50
              total += distanceValues[rowIndex][colIndex]
          }
      })
  })

  // add a lot of value to moves that win the game
  // 14 marbles total, if 6 pushed off, then 8 remain === game over
  if (minCount <= 8) {
    total += 100
  } else if (maxCount <= 8) {
    total -= 100
  }

  return total
}
