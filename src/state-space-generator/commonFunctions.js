/**
 * Gets a new copy of the empty board state
 */
export const getEmptyBoardState = () => [
    [0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0],
]

// compass move direction enum
export const moveDirection = Object.freeze({
    NE: 0,
    E: 1,
    SE: 2,
    SW: 3,
    W: 4,
    NW: 5,
})

export const numToDir = {
    0: 'NE',
    1: 'E',
    2: 'SE',
    3: 'SW',
    4: 'W',
    5: 'NW',
}

// move type enum
export const moveType = Object.freeze({
    INLINE: 0,
    SIDE: 1,
})

// marble group size enum
export const marbleGroupSize = Object.freeze({
    TWO: 0,
    THREE: 3
})

export const inputCells = [
    'A3b',
    'B2b',
    'B3b',
    'C3b',
    'C4b',
    'G7b',
    'G8b',
    'H7b',
    'H8b',
    'H9b',
    'I8b',
    'I9b',
    'A4w',
    'A5w',
    'B4w',
    'B5w',
    'B6w',
    'C5w',
    'C6w',
    'G4w',
    'G5w',
    'H4w',
    'H5w',
    'H6w',
    'I5w',
    'I6w',
]

export const inputCells2 = [
    'E3b', 'E4b', 'E5b', 'F4b', 'F5b', 'E6w', 'E7w', 'F6w', 'F7w', 'F8w'
]

export const letterToNumber = {
    I: 0,
    H: 1,
    G: 2,
    F: 3,
    E: 4,
    D: 5,
    C: 6,
    B: 7,
    A: 8,
}

export const numberToLetter = {
    0: 'I',
    1: 'H',
    2: 'G',
    3: 'F',
    4: 'E',
    5: 'D',
    6: 'C',
    7: 'B',
    8: 'A',
}

export const colourValLetterToNum = {
    w: 2, // 2 == white
    b: 3, // 3 == black
}

export const colourValNumToLetter = {
    2: 'w', // 2 == white
    3: 'b', // 3 == black
}

export function stringifyState(state) {
    const convertedState = []
    state.forEach((row, rowIndex) => {
        row.forEach((space, colIndex) => {
            if (space === 2 || space === 3) {
                convertedState.push(`${numberToLetter[rowIndex]}${colIndex + 1}${
                    colourValNumToLetter[space]
                }`)
            }
        })
    })
    // sort first by colour (b->w), then by row (A->I), then by column (1->9)
    convertedState.sort((a, b) => {
        const aColour = a.charCodeAt(2)
        const bColour = b.charCodeAt(2)
        if (aColour !== bColour) { // if not the same colour, return black before white
            return aColour - bColour
        } else { // if same colour, return in order by row
            const aRow = a.charCodeAt(0)
            const bRow = b.charCodeAt(0)
            if (aRow !== bRow) { // if not the same row, return in alphabetical row order
                return aRow - bRow
            } else { // if same row, return in order by column
                const aCol = parseInt(a.charAt(1))
                const bCol = parseInt(b.charAt(1))
                return aCol - bCol
            }
        }
    })
   return convertedState.join(',')
}

/**
 * Stringifies list of states
 * @param {Array} states array of board states (matrices)
 */
export function getStringifiedStates(states) {
    let stringifiedStates = ''
    states.forEach((state) => {
        stringifiedStates += `${stringifyState(state)}\n`
    })
    return stringifiedStates
}

/**
 * Verifies whether a spot in the board is empty (not off the board or occupied by another marble)
 * @param {number} row row index
 * @param {number} column column index
 * @param {Array} state board matrix
 */
export const isEmpty = (row, column, state) => {
    if (row > -1 && column > -1 && row < 9 && column < 9) {
        // if it's not outside of the matrix
        const space = state[row][column]
        if (space === 1) {
            return true
        }
    }
}

/**
 * Verifies whether a spot in the board is empty or off the board
 * @param {number} row row index
 * @param {number} column column index
 * @param {Array} state board matrix
 */
export const isEmptyOrOffBoard = (row, column, state) => {
    if (row < 0 || row > 8 || column < 0 || column > 8) {
        return true
    }
    const space = state[row][column]
    if (space === 1 || space === 0) {
        return true
    }
}

/**
 * Verifies whether a spot in the board is empty (not off the board or occupied by another marble)
 * @param {number} row row index
 * @param {number} column column index
 * @param {Array} state board matrix
 * @param {string} colour black or white ("w" || "b")
 */
export const isOccupied = (row, column, state, colour) => {
    const oppositeColour = colour === 'w' ? 'b' : 'w'
    if (row > -1 && column > -1 && row < 9 && column < 9) {
        // if it's not outside of the matrix
        const space = state[row][column]
        if (space === colourValLetterToNum[oppositeColour]) {
            return true
        }
    }
}
