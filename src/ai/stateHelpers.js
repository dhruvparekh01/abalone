
import _ from "lodash"
import { 
    // board1,
    // board2,
    // board11,
    board12 
} from '../state-space-generator'

// compass move direction enum
const moveDirection = Object.freeze({
  NE: 0,
  E: 1,
  SE: 2,
  SW: 3,
  W: 4,
  NW: 5,
})

// move type enum
const moveType = Object.freeze({
  INLINE: 0,
  SIDE: 1,
})

// marble group size enum
const marbleGroupSize = Object.freeze({
  TWO: 0,
  THREE: 3
})

export const colourValLetterToNum = {
  w: 2, // 2 == white
  b: 3, // 3 == black
}

// const colourValNumToLetter = {
//   2: 'w', // 2 == white
//   3: 'b', // 3 == black
// }

/**
 * Verifies whether a spot in the board is empty (not off the board or occupied by another marble)
 * @param {number} row row index
 * @param {number} column column index
 * @param {Array} state board matrix
 */
const isEmpty = (row, column, state) => {
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
const isEmptyOrOffBoard = (row, column, state) => {
  if (row < 0 || row > 8 || column < 0 || column > 8) {
      return true
  }
  const space = state[row][column]
  if (space === 1 || space === 0) {
      return true
  }
}

/**
 * Alters the board state by moving a marble to another position on the board and emptying the space it was in
 * @param {Array} start starting position
 * @param {Array} destination ending position
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} state state matrix
 */
export const moveMarble = (start, destination, colour, state) => {
  state[destination[0]][destination[1]] = colourValLetterToNum[colour]
  state[start[0]][start[1]] = 1 // empty
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
  if ((row > -1 && row < 9 && column > -1 && column < 9) && state[row][column] === 1) {
      state[row][column] = colourValLetterToNum[colour]
  }
}

/**
* Verifies whether a spot in the board is empty (not off the board or occupied by another marble)
* @param {number} row row index
* @param {number} column column index
* @param {Array} state board matrix
* @param {string} colour black or white ("w" || "b")
*/
const isOccupied = (row, column, state, colour) => {
  const oppositeColour = colour === 'w' ? 'b' : 'w'
  if (row > -1 && column > -1 && row < 9 && column < 9) {
      // if it's not outside of the matrix
      const space = state[row][column]
      if (space === colourValLetterToNum[oppositeColour]) {
          return true
      }
  }
}

/**
 * Verifies that this group of marbles is all the same colour and therefore a valid group of marbles
 * @param {Array} state state matrix
 * @param {Array} marbles spaces in this group in matrix form ie. [group of spaces][row and column]
 * @param {string} colour black or white ("w" || "b")
 */
export const validateGroup = (state, marbles, colour) => {
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
 * Finds all the groups of two marbles of the specified colour
 * @param {string} colour black or white ("w" || "b")
 */
const getDoubleMarbles = (colour, state) => {
  const doubles = []

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
const getTripleMarbles = (colour, state) => {
   const triples = []

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

export const sortMarbleGroup = (marbles) => {
  return marbles.sort((a, b) => {
    const colA = a[1]
    const colB = b[1]
    if (colA !== colB) {
      return colA - colB // sort by column first (left to right)
    } else {
      return a[0] - b[0] // sort by row second (top to bottom)
    }
  })
}

/**
 * Moves a set of three marbles with either an inline move or a side move and pushes new board state to the
 * list of resulting states
 * @param {Array} marbles set of 3 marbles
 * @param {moveDirection} direction NE || E || SE || SW || W || NW
 * @param {moveType} type INLINE || SIDE
 * @param {string} colour black or white ("w" || "b")
 * @param {Array} resultingStatesAndMoves array of object containing the board states (matrices) and the corresponding moves to achieve that state
 */
const moveMarbleGroup = (
  marbles,
  direction,
  type,
  colour,
  resultingStatesAndMoves,
  state
) => {

  const newState = _.cloneDeep(state) // copy state
  const move = {marbles: marbles, direction: direction}

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
      if (isEmpty(destination[0], destination[1], newState)) {
          moveMarble(startMarble, destination, colour, newState)
          resultingStatesAndMoves.push({state: newState, move: move})
      } else if (isOccupied(destination[0], destination[1], newState, colour)) {
          // if opposing marble is there, then we can potentially sumito
          // check next position in line. if empty or off the board, sumito can occur
          if (
              isEmptyOrOffBoard(
                  sumitoDestination1[0],
                  sumitoDestination1[1],
                  newState,
                  colour
              )
          ) {
              // startMarble -> empty
              // destination -> colour
              // sumitoDestination1 -> opposing colour (if on board, nothing otherwise (marble is removed))
              moveMarble(startMarble, destination, colour, newState)
              placeMarble(
                  sumitoDestination1,
                  colour === 'w' ? 'b' : 'w',
                  newState
              )
              resultingStatesAndMoves.push({state: newState, move: move})
              // if another opposing marble & group is 3 marbles, sumito still possible
              // check one spot more. if empty or off the board, sumito can occur
          } else if (
              marbles.length > 2 && isOccupied(
                  sumitoDestination1[0],
                  sumitoDestination1[1],
                  newState,
                  colour
              )
          ) {
              if (
                  isEmptyOrOffBoard(
                      sumitoDestination2[0],
                      sumitoDestination2[1],
                      newState,
                      colour
                  )
              ) {
                  // startMarble -> empty
                  // destination -> colour
                  // sumitoDestination2 -> opposing colour (if on board, nothing otherwise (marble is removed))
                  moveMarble(startMarble, destination, colour, newState)
                  placeMarble(
                      sumitoDestination2,
                      colour === 'w' ? 'b' : 'w',
                      newState
                  )
                  resultingStatesAndMoves.push({state: newState, move: move})
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
              moveMarble(marbles[index], space, colour, newState)
          })
          resultingStatesAndMoves.push({state: newState, move: move})
      }
  }

}


/**
 * Determine the direction that a single marble moved in based on its old and new positions
 * @param {Array} oldPos the old position of the marble
 * @param {Array} newPos the new position of the marble
 */
function getDirection(oldPos, newPos) {
    if (oldPos[0] === newPos[0]) {
        if (oldPos[1] > newPos[1])
            return moveDirection.W
        else 
            return moveDirection.E
    }
     else {
        if (oldPos[0] > newPos[0]) {
            if (oldPos[1] === newPos[1])
                return moveDirection.NW
            else 
                return moveDirection.NE
        } else {
            if (oldPos[1] === newPos[1])
                return moveDirection.SE
            else 
                return moveDirection.SW
        }
    }
}

/**
 * Loops through the matrix of marble locations
 * If the marble at the current index is the current colour, examine the locations around that marble
 * There are 6 maximum directions a single marble can move
 * If there is an empty spot in that direction, the marble can move there - generate a new state with that move
 * Single marbles can't be a sumito, so locations with opposite colours are not available
 * @param {string} colour black or white ("w" || "b")
 */
const getSingleMarbleMoves = (colour, state) => {
  const resultingStatesAndMoves = []
  const colourNum = colourValLetterToNum[colour.charAt(0)]

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
                      const newState = _.cloneDeep(state)
                      moveMarble(
                          marble,
                          destination,
                          colour,
                          newState
                      )
                      const move = {marbles: [[rowIndex, colIndex]], direction: getDirection([rowIndex, colIndex], destination)}
                    //   moves.push({marbles: [rowIndex, colIndex], destination: destination})
                      resultingStatesAndMoves.push({state: newState, move:move})
                  }
              })
          }
      })
  })
  return [resultingStatesAndMoves]
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
const getMarbleGroupMoves = (colour, size, state) => {
  const groups = size === marbleGroupSize.TWO ? getDoubleMarbles(colour, state) : getTripleMarbles(colour, state)
  const resultingStates = []

  groups.forEach((group) => {
      // look at end marbles in the group to determine what direction they lay in
      const firstMarble = group[0]
      const lastMarble = group[group.length - 1]

      // SW/NE
      if (firstMarble[0] > lastMarble[0] && firstMarble[1] < lastMarble[1]) {
          // inline: SW and NE
          moveMarbleGroup(
              group,
              moveDirection.NE,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.SW,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          // side: NW, W, SE, E
          moveMarbleGroup(
              group,
              moveDirection.NW,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.W,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.SE,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.E,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
      }
      // W/E
      else if (
          firstMarble[0] === lastMarble[0] &&
          firstMarble[1] < lastMarble[1]
      ) {
          // inline: W and E
          moveMarbleGroup(
              group,
              moveDirection.W,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.E,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          // side: NW, SW, SE, NE
          moveMarbleGroup(
              group,
              moveDirection.NW,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.SW,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.SE,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.NE,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
      }
      // NW/SE
      else if (
          firstMarble[0] < lastMarble[0] &&
          firstMarble[1] === lastMarble[1]
      ) {
          // inline: NW and SE
          moveMarbleGroup(
              group,
              moveDirection.NW,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.SE,
              moveType.INLINE,
              colour,
              resultingStates,
              state
          )
          // side: SW, W, NE, E
          moveMarbleGroup(
              group,
              moveDirection.SW,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.W,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.NE,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
          moveMarbleGroup(
              group,
              moveDirection.E,
              moveType.SIDE,
              colour,
              resultingStates,
              state
          )
      }
  })
  return resultingStates
}

export const generateAllBoardStates = (colour, state) => {
  // generate single marble moves
  const [singleMarbleStatesAndMoves] = getSingleMarbleMoves(colour, state)
  
  // generate double marble moves
  const doubleMarbleStatesAndMoves = getMarbleGroupMoves(colour, marbleGroupSize.TWO, state)
  
  // generate triple marble moves
  const tripleMarbleStatesAndMoves = getMarbleGroupMoves(colour, marbleGroupSize.THREE, state)

  return [...tripleMarbleStatesAndMoves, ...doubleMarbleStatesAndMoves, ...singleMarbleStatesAndMoves]
}

export const validateGeneratedBoards = (stringifiedStates) => {
    // swap in board1, board2, board11, or board 12 to test for input1, input2, and so on
    const boardLines = board12.split('\n')
    let stringifiedStatesLines = stringifiedStates.split('\n')
    stringifiedStatesLines.splice(-1,1)

    let inBoard = 0
    let notInBoard = 0
    stringifiedStatesLines.forEach((state, index) => {
        if (boardLines.includes(state)) {
            inBoard++
        } else {
            notInBoard++
            console.log(`Broken index: ${index}`)
        }
    })
    console.log(`In board: ${inBoard}, not in board: ${notInBoard}`)
}
