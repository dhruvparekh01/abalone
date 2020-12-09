import getState from './getState'
import { isEmptyOrOffBoard, marbleGroupSize, moveType, moveDirection, isEmpty, isOccupied, colourValLetterToNum, numberToLetter, numToDir } from './commonFunctions'


/**
 * Alters the board state by placing a marble on the board
 * @param {Array} destination destination coordinates
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} state state matrix
 */
const placeMarble = (destination, colour, state) => {
    const row = destination[0]
    const column = destination[1]
    if ((row > -1 && row < 9 && column > -1 && column < 9) && state[row][column] === 1) {
        state[row][column] = colourValLetterToNum[colour]
    }
  }

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

/**
 * Finds all the groups of two marbles of the specified colour
 * @param {string} colour black or white ("w" || "b")
 */
const getDoubleMarbles = (colour) => {
    const doubles = []
    const state = getState()

    state.forEach((row, rowIndex) => {
        row.forEach((space, colIndex) => {
            if (space === colourValLetterToNum[colour]) {
                // potential triples starting at this marble
                const potentialDoubles = [
                    [
                        // SW to NE
                        // -- 1st marble: row - 1, col + 1
                        [rowIndex - 1, colIndex + 1],
                    ],
                    [
                        // W to E
                        // -- 1st marble: row, col + 1
                        [rowIndex, colIndex + 1],
                    ],
                    [
                        // NW to SE
                        // -- 1st marble: row + 1, col
                        [rowIndex + 1, colIndex],
                    ],
                ]
                potentialDoubles.forEach((double) => {
                    if (
                        validateGroup(
                            state,
                            double,
                            colourValLetterToNum[colour]
                        )
                    ) {
                        doubles.push([[rowIndex, colIndex], ...double])
                    }
                })
            }
        })
    })
    return doubles
}

/**
 * Finds all the groups of three marbles of the specified colour
 * @param {string} colour black or white ("w" || "b")
 */
const getTripleMarbles = (colour) => {
    const triples = []
    const state = getState()

    state.forEach((row, rowIndex) => {
        row.forEach((space, colIndex) => {
            if (space === colourValLetterToNum[colour]) {
                // potential triples starting at this marble
                const potentialTriples = [
                    [
                        // SW to NE
                        // -- 1st marble: row - 1, col + 1
                        // -- 2nd marble: row - 2, col + 2
                        [rowIndex - 1, colIndex + 1],
                        [rowIndex - 2, colIndex + 2],
                    ],
                    [
                        // W to E
                        // -- 1st marble: row, col + 1
                        // -- 2nd marble: row, col + 2
                        [rowIndex, colIndex + 1],
                        [rowIndex, colIndex + 2],
                    ],
                    [
                        // NW to SE
                        // -- 1st marble: row + 1, col
                        // -- 2nd marble: row + 2, col
                        [rowIndex + 1, colIndex],
                        [rowIndex + 2, colIndex],
                    ],
                ]
                potentialTriples.forEach((triple) => {
                    if (
                        validateGroup(
                            state,
                            triple,
                            colourValLetterToNum[colour]
                        )
                    ) {
                        triples.push([[rowIndex, colIndex], ...triple])
                    }
                })
            }
        })
    })
    return triples
}

/**
 * Verifies that this group of marbles is all the same colour and therefore a valid group of marbles
 * @param {Array} state state matrix
 * @param {Array} marbles spaces in this group in matrix form ie. [group of spaces][row and column]
 * @param {string} colour black or white ("w" || "b")
 */
const validateGroup = (state, marbles, colour) => {
    let isValid = true
    marbles.forEach(([row, col]) => {
        if (row > -1 && row < 9 && col > -1 && col < 9) {
            // ensure spaces are on the board
            if (state[row][col] !== colour) {
                // ensure spaces are of the same colour
                isValid = false
            }
        } else {
            isValid = false
        }
    })
    return isValid
}

/**
 * Moves a set of three marbles with either an inline move or a side move and pushes new board state to the
 * list of resulting states
 * @param {Array} marbles set of 3 marbles
 * @param {moveDirection} direction NE || E || SE || SW || W || NW
 * @param {moveType} type INLINE || SIDE
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} resultingStates array of board states (matrices)
 */
const moveMarbleGroup = (
    marbles,
    direction,
    type,
    colour,
    resultingStates
) => {
    const state = getState()
    if (type === moveType.INLINE) {
        const firstMarble = marbles[0]
        const lastMarble = marbles[marbles.length - 1]
        let destination // becomes full
        let startMarble // becomes empty

        // only used for sumito
        let sumitoDestination1
        let sumitoDestination2
        switch (direction) {
            case moveDirection.NE:
                // marbles must be in SW/NE position
                // check NE (row - 1, col + 1)
                destination = [lastMarble[0] - 1, lastMarble[1] + 1]
                sumitoDestination1 = [lastMarble[0] - 2, lastMarble[1] + 2]
                sumitoDestination2 = [lastMarble[0] - 3, lastMarble[1] + 3]
                startMarble = firstMarble
                break
            case moveDirection.E:
                // marbles must be in W/E position
                // check E (row, col + 1)
                destination = [lastMarble[0], lastMarble[1] + 1]
                sumitoDestination1 = [lastMarble[0], lastMarble[1] + 2]
                sumitoDestination2 = [lastMarble[0], lastMarble[1] + 3]
                startMarble = firstMarble
                break
            case moveDirection.SE:
                // marbles must be in NW/SE position
                // check SE (row + 1, col)
                destination = [lastMarble[0] + 1, lastMarble[1]]
                sumitoDestination1 = [lastMarble[0] + 2, lastMarble[1]]
                sumitoDestination2 = [lastMarble[0] + 3, lastMarble[1]]
                startMarble = firstMarble
                break
            case moveDirection.SW:
                // marbles must be in SW/NE position
                // check SW (row + 1, col - 1)
                destination = [firstMarble[0] + 1, firstMarble[1] - 1]
                sumitoDestination1 = [firstMarble[0] + 2, firstMarble[1] - 2]
                sumitoDestination2 = [firstMarble[0] + 3, firstMarble[1] - 3]
                startMarble = lastMarble
                break
            case moveDirection.W:
                // marbles must be in W/E position
                // check W (row, col - 1)
                destination = [firstMarble[0], firstMarble[1] - 1]
                sumitoDestination1 = [firstMarble[0], firstMarble[1] - 2]
                sumitoDestination2 = [firstMarble[0], firstMarble[1] - 3]
                startMarble = lastMarble
                break
            default:
                // NW
                // marbles must be in NW/SE position
                // check NW (row - 1, col)
                destination = [firstMarble[0] - 1, firstMarble[1]]
                sumitoDestination1 = [firstMarble[0] - 2, firstMarble[1]]
                sumitoDestination2 = [firstMarble[0] - 3, firstMarble[1]]
                startMarble = lastMarble
                break
        }
        if (isEmpty(destination[0], destination[1], state)) {
            moveMarble(startMarble, destination, colour, state)
            resultingStates.push(state)
            return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`
        } else if (isOccupied(destination[0], destination[1], state, colour)) {
            // if opposing marble is there, then we can potentially sumito
            // check next position in line. if empty or off the board, sumito can occur
            if (
                isEmptyOrOffBoard(
                    sumitoDestination1[0],
                    sumitoDestination1[1],
                    state,
                    colour
                )
            ) {
                // startMarble -> empty
                // destination -> colour
                // sumitoDestination1 -> opposing colour (if on board, nothing otherwise (marble is removed))
                moveMarble(startMarble, destination, colour, state)
                placeMarble(
                    sumitoDestination1,
                    colour === 'w' ? 'b' : 'w',
                    state
                )
                resultingStates.push(state)
                return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`
                // if another opposing marble & group is 3 marbles, sumito still possible
                // check one spot more. if empty or off the board, sumito can occur
            } else if (
                marbles.length > 2 && isOccupied(
                    sumitoDestination1[0],
                    sumitoDestination1[1],
                    state,
                    colour
                )
            ) {
                if (
                    isEmptyOrOffBoard(
                        sumitoDestination2[0],
                        sumitoDestination2[1],
                        state,
                        colour
                    )
                ) {
                    // startMarble -> empty
                    // destination -> colour
                    // sumitoDestination2 -> opposing colour (if on board, nothing otherwise (marble is removed))
                    moveMarble(startMarble, destination, colour, state)
                    placeMarble(
                        sumitoDestination2,
                        colour === 'w' ? 'b' : 'w',
                        state
                    )
                    resultingStates.push(state)
                    return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`;
                }
            }
        }
    } else {
        // Side moves cannot be sumito, so all destination spots must be empty
        let spacesToCheck = []
        let allClear = true
        switch (direction) {
            case moveDirection.NE:
                // marbles must be in NW/SE or W/E position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row - 1, col + 1])
                })
                break
            case moveDirection.E:
                // marbles must be in SW/NE or NW/SE position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row, col + 1])
                })
                break
            case moveDirection.SE:
                // marbles must be in SW/NE or W/E position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row + 1, col])
                })
                break
            case moveDirection.SW:
                // marbles must be in NW/SE or W/E position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row + 1, col - 1])
                })
                break
            case moveDirection.W:
                // marbles must be in SW/NE or NW/SE position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row, col - 1])
                })
                break
            default:
                // NW
                // marbles must be in SW/NE or W/E position
                marbles.forEach(([row, col]) => {
                    spacesToCheck.push([row - 1, col])
                })
        }
        spacesToCheck.forEach(([row, col]) => {
            if (!isEmpty(row, col, state)) {
                allClear = false
            }
        })
        if (allClear) {
            spacesToCheck.forEach((space, index) => {
                moveMarble(marbles[index], space, colour, state)
            })
            const firstMarble = marbles[0]
            const lastMarble = marbles[marbles.length - 1]
            resultingStates.push(state)
            return `[${numberToLetter[firstMarble[0]]}${firstMarble[1] + 1}, ${numberToLetter[lastMarble[0]]}${lastMarble[1] + 1}] - ${numToDir[direction]}`
        }
    }
}


/**
 * Finds all inline and side moves for sets of two or three marbles
 * Groups can be in 3 positons: SW/NE, W/E, NW/SE (\, --, /)
 * - inline (2 options each):
 *     - SW/NE, moves are SW and NE
 *     - W/E, moves are W and E
 *     - NW/SE, moves are NW and SE
 * - side (4 options each):
 *     - SW/NE, moves are NW, W, SE, E
 *     - W/E, moves are NW, SW, SE, NE
 *     - NW/SE, moves are SW, W, NE, E
 * if inline and next space is empty = valid move
 * if occupied by opposite colour, can move if 1 or 2 marbles (pushing marbles)
 * @param {string} colour black or white ("w" || "b")
 * @param {marbleGroupSize} size TWO || THREE
 */
export default function getMarbleGroupMoves(colour, size) {
    const groups = size === marbleGroupSize.TWO ? getDoubleMarbles(colour) : getTripleMarbles(colour)
    const resultingStates = []
    const moves = []

    groups.forEach((group) => {
        // look at end marbles in the group to determine what direction they lay in
        const firstMarble = group[0]
        const lastMarble = group[1]

        // SW/NE
        if (firstMarble[0] > lastMarble[0] && firstMarble[1] < lastMarble[1]) {
            // inline: SW and NE
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NE,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SW,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            // side: NW, W, SE, E
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NW,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.W,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SE,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.E,
                moveType.SIDE,
                colour,
                resultingStates
            ))
        }
        // W/E
        else if (
            firstMarble[0] === lastMarble[0] &&
            firstMarble[1] < lastMarble[1]
        ) {
            // inline: W and E
            moves.push(moveMarbleGroup(
                group,
                moveDirection.W,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.E,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            // side: NW, SW, SE, NE
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NW,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SW,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SE,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NE,
                moveType.SIDE,
                colour,
                resultingStates
            ))
        }
        // NW/SE
        else if (
            firstMarble[0] < lastMarble[0] &&
            firstMarble[1] === lastMarble[1]
        ) {
            // inline: NW and SE
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NW,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SE,
                moveType.INLINE,
                colour,
                resultingStates
            ))
            // side: SW, W, NE, E
            moves.push(moveMarbleGroup(
                group,
                moveDirection.SW,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.W,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.NE,
                moveType.SIDE,
                colour,
                resultingStates
            ))
            moves.push(moveMarbleGroup(
                group,
                moveDirection.E,
                moveType.SIDE,
                colour,
                resultingStates
            ))
        }
    })
    return [resultingStates, moves]
}
