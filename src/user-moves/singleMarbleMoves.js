import { colourValLetterToNum, moveDirection } from '../state-space-generator/commonFunctions'

/**
 * Alters the board state by moving a marble to another position on the board and emptying the space it was in
 * @param {Array} start starting position
 * @param {Array} destination ending position
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} gameBoard state matrix
 */
export const moveMarbleUserDirection = (start, direction, colour, gameBoard) => { 
    const destination = start.slice();

    switch (direction) {
        case moveDirection.W:
            destination[1] -= 1
            break;
        
        case moveDirection.E:
            destination[1] += 1
            break;
        
        case moveDirection.NW:
            destination[0] -= 1
            break;
        
        case moveDirection.NE:
            destination[0] -= 1
            destination[1] += 1
            break;
        
        case moveDirection.SE:
            destination[0] += 1
            break;
        
        case moveDirection.SW:
            destination[0] += 1
            destination[1] -= 1
            break;
    
        default:
            break;
    }

    // Move possible only if the spot is empty
    if (gameBoard[destination[0]][destination[1]] !== 1) {
        return [gameBoard, false]
    }

    let gameBoardCopy = gameBoard.map(row => row.slice())

    // console.log(colour);

    gameBoardCopy[destination[0]][destination[1]] = colourValLetterToNum[colour]
    gameBoardCopy[start[0]][start[1]] = 1 // empty

    // console.log("Game Board Copy");
    // console.log(gameBoardCopy);

    return [gameBoardCopy, true]
}


/**
 * Alters the board state by moving a marble to another position on the board and emptying the space it was in
 * @param {Array} start starting position
 * @param {Array} destination ending position
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} gameBoard state matrix
 */
export const moveMarbleUser = (start, destination, colour, gameBoard) => {
    let gameBoardCopy = gameBoard.map(row => row.slice())

    // console.log(colour);

    gameBoardCopy[destination[0]][destination[1]] = colourValLetterToNum[colour]
    gameBoardCopy[start[0]][start[1]] = 1 // empty

    // console.log("Game Board Copy");
    // console.log(gameBoardCopy);

    return gameBoardCopy
}
