import { colourValLetterToNum } from './stateHelpers'

export function dhruvHeuristic(state, maxPlayer) {
    let total = 0

  const maxColour = colourValLetterToNum[maxPlayer]
  const minColour = maxColour === 3 ? 2 : 3

  total = horizontalScores(state, maxColour) + nwToSeDiagonal(state, maxColour) + neToSwDiagonal(state, maxColour) - horizontalScores(state, minColour) - nwToSeDiagonal(state, minColour) - neToSwDiagonal(state, maxColour)

  return total
}

function horizontalScores(state, colour) {
    let score = 0
    let maxCount = 0
    state.forEach(row => {
        maxCount = 0
        row.forEach(space => {
            if (space === colour) {
                maxCount ++
                if (maxCount === 1) {
                    score += 71
                } else if (maxCount === 2) {
                    score += 72
                } else if (maxCount === 3) {
                    score += 73
                } else {
                    score += 70
                }
            }
        })
    })

    return score
}

function nwToSeDiagonal(state, colour) {
    let score = 0
    let maxCount = 0

    for (let col=0; col<state[0].length - 1; col++) {
        for (let row=0; row<state.length - 1; row++) {
            console.log(row);
            if (state[row][col] === colour) {
                maxCount ++
                if (maxCount === 1) {
                    score += 71
                } else if (maxCount === 2) {
                    score += 72
                } else if (maxCount === 3) {
                    score += 73
                } else {
                    score += 70
                }
            }
        }
    }

    return score
}

function neToSwDiagonal(state, colour) {
    let score = 0
    let maxCount = 0

    for (let col=0; col<state[0].length - 1; col++) {
        let tempCol = col
        for (let row=0; row<state.length - 1; row++, tempCol++) {
            if (state[row][col] === colour) {
                maxCount ++
                if (maxCount === 1) {
                    score += 71
                } else if (maxCount === 2) {
                    score += 72
                } else if (maxCount === 3) {
                    score += 73
                } else {
                    score += 70
                }
            }
        }
    }

    return score
}
