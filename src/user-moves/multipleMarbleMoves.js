import { isEmptyOrOffBoard, moveType, moveDirection, isEmpty, isOccupied, colourValLetterToNum } from '../state-space-generator/commonFunctions'

/**
 * Returns the first and last marbles from a list of marbles if they are in line, else returns empty 2d array
 * @param {Array} marbles List of marbles to be validated
 */
function findStartAndEndMarble(marbles) {
    switch(marbles.length) {
        case 2:
            return marbles
        case 3:
            let startMarble
            let endMarble
    
            const minRow = Math.min(marbles[0][0], marbles[1][0], marbles[2][0])
            const maxRow = Math.max(marbles[0][0], marbles[1][0], marbles[2][0])

            const minCol = Math.min(marbles[0][1], marbles[1][1], marbles[2][1])
            const maxCol = Math.max(marbles[0][1], marbles[1][1], marbles[2][1])

            
            // Check if the 3 marbles make a horizontal line formation
            const isHorizontal = minRow === maxRow
            
            // Check if the 3 marbles make a diagonal line formation
            // This happens for a 3 marble group when the top-most and bottom-most marbles have difference of 2
            const isDiagonal = maxRow - minRow === 2
    
            if (isHorizontal) {
                // The row value of all the marbles is same so the min col is the 1st and max col is last marble
                startMarble = [marbles[0][0], minCol]
                endMarble = [marbles[0][0], maxCol]
            } else if (isDiagonal) {
                // The marble with max row will be the 1st and the one with min row will be the last
                startMarble = marbles.find(marble => marble[0] === maxRow)
                endMarble = marbles.find(marble => marble[0] === minRow)
            } else {
                // The marbles are making a triangle formation or are scattered by a lot
                startMarble = [null, null]
                endMarble = [null, null]
            }
            return[startMarble, endMarble]
        default:
            // Length > 3, will probably never happen
            return [[null, null], [null, null]]
    }
}

// Validate a selection of 2 marbles
export const validateSelection = (marbles, board) => {
    const [[startRow, startCol], [endRow, endCol]] = findStartAndEndMarble(marbles)
    // If there is a triangle formation or marbles are scattered too far apart
    if (startRow === null) {
        return false
    }
    // Check if start cell and end cell are the same and not empty
    const startVal = board[startRow][startCol];
    const endVal = board[endRow][endCol];
    if (startVal !== endVal || startVal === 0 || startVal === 1) {
        return false;
    }

    let midVal
    if (marbles.length === 3) {
        // Middile cell (3-marble selection) needs to be the same as start cell
        const midRow = Math.floor((startRow + endRow) / 2)
        const midCol = Math.floor((startCol + endCol) / 2)
        midVal = board[midRow][midCol]
    } else {
        // If only 2 marbles are selected, midVal doesn't matter, set it to the color of the selected marbles
        midVal = board[startRow][startCol]
    }

    // Horizontal line formation
    if (startRow === endRow) {
        return Math.abs(startCol - endCol) < 3 && midVal === startVal
    }

    // N-W formation
    if (startCol === endCol) {
        return Math.abs(startRow - endRow) < 3 && midVal === startVal
    }

    // N-E formation
    return startRow - endRow === endCol - startCol
        ? Math.abs(startRow - endRow) < 3 && midVal === startVal
        : false
}

/**
 * Alters the board state by placing a marble on the board
 * @param {Array} destination destination coordinates
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} state state matrix
 */
const placeMarble = (destination, colour, state) => {
    const row = destination[0]
    const column = destination[1]
    const newState = state.map(row => row.slice())
    if ((row > -1 && row < 9 && column > -1 && column < 9) && state[row][column] === 1) {
        newState[row][column] = colourValLetterToNum[colour]
    }
    return newState
}

/**
 * Alters the board state by moving a marble to another position on the board and emptying the space it was in
 * @param {Array} start starting position
 * @param {Array} destination ending position
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} gameBoard state matrix
 */
const moveMarble = (start, destination, colour, gameBoard) => {
    let gameBoardCopy = gameBoard.map(row => row.slice())

    gameBoardCopy[destination[0]][destination[1]] = colourValLetterToNum[colour]
    gameBoardCopy[start[0]][start[1]] = 1 // empty

    return gameBoardCopy
}

/**
 * Sort the marbles so that the leftmost one is always at the biginning of the array and the right-most one is always
 * at the end
 * @param {Array} marbles List of 2 or 3 marbles
 */
function sortMarbles(marbles) {
    // get a list of rows and columns
    const rows = marbles.map(marble => marble[0])
    const cols = marbles.map(marble => marble[1])

    let maxRow = Math.max(...rows)
    let minRow = Math.min(...rows)

    const maxCol = Math.max(...cols)
    let minCol = Math.min(...cols)

    // Check if the marbles make a diagonal line formation
    const isHorizontal = maxRow === minRow

    if (isHorizontal) {
        // They are all in the same row and column increases by 1 for each marble
        return rows.map(row => [row, minCol++])
    } else {
        // NW-SE
        if (minCol === maxCol) {
            // They are all in the same column and row increases by 1 for each marble
            return cols.map(col => [minRow++, col])
        }
        // NE-SW
        else {
            // Both, column and row increase by 1 for each marble
            return cols.map(col => [maxRow--, minCol++])
        }
    }
}


/**
 * Moves a set of three marbles with either an inline move or a side move and pushes new board state to the
 * list of resulting states
 * @param {Array} sortedMarbles set of 3 marbles
 * @param {moveDirection} direction NE || E || SE || SW || W || NW
 * @param {moveType} type INLINE || SIDE
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} resultingStates array of board states (matrices)
 * @returns {Array} [newGameBoard, madeMove] the new game board if a move is made, else, the original game board and false
 */
export const moveMarbleGroup = (
    marbles,
    direction,
    type,
    colour,
    gameBoard,

) => {
    const sortedMarbles = sortMarbles(marbles);
    let newGameBoard = gameBoard.map(row => row.slice())
    if (type === moveType.INLINE) {
        const firstMarble = sortedMarbles[0]
        const lastMarble = sortedMarbles[sortedMarbles.length - 1]
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
        if (isEmpty(destination[0], destination[1], newGameBoard)) {
            newGameBoard = moveMarble(startMarble, destination, colour, newGameBoard)
            return [newGameBoard, true]
            // setGameBoard(newGameBoard)
            // resultingStates.push(gameBoard)
            // return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`
        } else if (isOccupied(destination[0], destination[1], gameBoard, colour)) {
            // if opposing marble is there, then we can potentially sumito
            // check next position in line. if empty or off the board, sumito can occur
            if (
                isEmptyOrOffBoard(
                    sumitoDestination1[0],
                    sumitoDestination1[1],
                    gameBoard,
                    colour
                )
            ) {
                // startMarble -> empty
                // destination -> colour
                // sumitoDestination1 -> opposing colour (if on board, nothing otherwise (marble is removed))
                newGameBoard = moveMarble(startMarble, destination, colour, gameBoard)
                newGameBoard = placeMarble(
                    sumitoDestination1,
                    colour === 'w' ? 'b' : 'w',
                    newGameBoard
                )
                return [newGameBoard, true]
                // resultingStates.push(gameBoard)
                // return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`
                // if another opposing marble & group is 3 marbles, sumito still possible
                // check one spot more. if empty or off the board, sumito can occur
            } else if (
                sortedMarbles.length > 2 && isOccupied(
                    sumitoDestination1[0],
                    sumitoDestination1[1],
                    gameBoard,
                    colour
                )
            ) {
                if (
                    isEmptyOrOffBoard(
                        sumitoDestination2[0],
                        sumitoDestination2[1],
                        gameBoard,
                        colour
                    )
                ) {
                    // startMarble -> empty
                    // destination -> colour
                    // sumitoDestination2 -> opposing colour (if on board, nothing otherwise (marble is removed))
                    newGameBoard = moveMarble(startMarble, destination, colour, gameBoard)
                    newGameBoard = placeMarble(
                        sumitoDestination2,
                        colour === 'w' ? 'b' : 'w',
                        newGameBoard
                    )
                    return [newGameBoard, true]
                    // resultingStates.push(gameBoard)
                    // return `[${numberToLetter[startMarble[0]]}${startMarble[1] + 1}, ${numberToLetter[destination[0]]}${destination[1] + 1}] - ${numToDir[direction]}`;
                }
            }
        } else {
            return [gameBoard, false]
        }
    } else {
        // Side moves cannot be sumito, so all destination spots must be empty
        let spacesToCheck = []
        let allClear = true
        switch (direction) {
            case moveDirection.NE:
                // marbles must be in NW/SE or W/E position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row - 1, col + 1])
                })
                break
            case moveDirection.E:
                // marbles must be in SW/NE or NW/SE position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row, col + 1])
                })
                break
            case moveDirection.SE:
                // marbles must be in SW/NE or W/E position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row + 1, col])
                })
                break
            case moveDirection.SW:
                // marbles must be in NW/SE or W/E position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row + 1, col - 1])
                })
                break
            case moveDirection.W:
                // marbles must be in SW/NE or NW/SE position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row, col - 1])
                })
                break
            default:
                // NW
                // marbles must be in SW/NE or W/E position
                sortedMarbles.forEach(([row, col]) => {
                    spacesToCheck.push([row - 1, col])
                })
        }
        spacesToCheck.forEach(([row, col]) => {
            if (!isEmpty(row, col, gameBoard)) {
                allClear = false
            }
        })
        if (allClear) {
            spacesToCheck.forEach((space, index) => {
                newGameBoard = moveMarble(sortedMarbles[index], space, colour, newGameBoard)
            })

            return [newGameBoard, true]
            // setGameBoard(newGameBoard)
            // resultingStates.push(gameBoard)
            // return `[${numberToLetter[firstMarble[0]]}${firstMarble[1] + 1}, ${numberToLetter[lastMarble[0]]}${lastMarble[1] + 1}] - ${numToDir[direction]}`
        } else {
            return [gameBoard, false]
        }
    }
}