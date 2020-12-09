
/**
 * Gets a new copy of the empty board state
 */
const getEmptyBoardState = () => [
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

const letterToNumber = {
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

// Get the state based on the "input" global variable
export default function getState() {
// module.exports = function getState() {
    // If the state exists in localstorage, get it from there
    const state = localStorage.getItem('state')
    if (state) {
        return JSON.parse(state)
    }

    // Else, construct state based on inputCells in localstorage
    const inputCells = JSON.parse(localStorage.getItem('inputCells'))
    const newState = getEmptyBoardState()

    // For each cell in input
    inputCells.forEach((cell) => {
        // Consider the 2D array to be a matrix and determine the row and column from the given notation
        const row = letterToNumber[cell.charAt(0)]
        const col = parseInt(cell.charAt(1)) - 1

        // Determine the color and modify the state array
        const isBlack = cell.charAt(2) === 'b'
        newState[row][col] = isBlack ? 3 : 2
    })
    localStorage.setItem('state', JSON.stringify(newState))
    JSON.stringify(newState)
    return newState
}
