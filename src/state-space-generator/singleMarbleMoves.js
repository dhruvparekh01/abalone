import getState from './getState'
import { colourValLetterToNum, isEmpty, numberToLetter } from './commonFunctions'

/**
 * Alters the board state by moving a marble to another position on the board and emptying the space it was in
 * @param {Array} start starting position
 * @param {Array} destination ending position
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} state state matrix
 */
const moveMarble = (start, destination, colour, state) => {
    state[destination[0]][destination[1]] = colourValLetterToNum[colour]
    state[start[0]][start[1]] = 1 // empty
}

// Temporarioly map the spacesToCheck to direction
const direction  = ['NW', 'NE', 'W', 'E', 'SW', 'SE']

/**
 * Loops through the matrix of marble locations
 * If the marble at the current index is the current colour, examine the locations around that marble
 * There are 6 maximum directions a single marble can move
 * If there is an empty spot in that direction, the marble can move there - generate a new state with that move
 * Single marbles can't be a sumito, so locations with opposite colours are not available
 * @param {string} colour black or white ("w" || "b")
 */
export default function getSingleMarbleMoves(colour) {
    const resultingStates = []
    const state = getState()
    const colourNum = colourValLetterToNum[colour.charAt(0)]
    let moves = []

    state.forEach((row, rowIndex) => {
        row.forEach((space, colIndex) => {
            if (state[rowIndex][colIndex] === colourNum) {
                const marble = [rowIndex, colIndex]
                const spacesToCheck = [
                    // check top two spots
                    [rowIndex - 1, colIndex],
                    [rowIndex - 1, colIndex + 1],
                    // check middle two spots
                    [rowIndex, colIndex - 1],
                    [rowIndex, colIndex + 1],
                    // check bottom two spots
                    [rowIndex + 1, colIndex - 1],
                    [rowIndex + 1, colIndex],
                ]

                spacesToCheck.forEach((destination, index) => {
                    if (isEmpty(destination[0], destination[1], state)) {
                        const newState = getState()
                        moveMarble(
                            marble,
                            destination,
                            colour,
                            newState
                        )
                        moves.push(`[${numberToLetter[rowIndex]}${colIndex+1}] - ${direction[index]}`)
                        resultingStates.push(newState)
                    }
                })
            }
        })
    })
    return [resultingStates, moves]
}
