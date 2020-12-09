import { generateAllBoardStates } from './stateHelpers'
import { emilyHeuristic } from './emilyHeuristic'
// import { robertHeuristic } from './robertHeuristic'

/**
 *
 * @param {Array} state state array
 * @param {number} depth what depth we are at now
 * @param {string} colour colour of the MAX player: black or white ("w" || "b")
 * @param {Date} endTime the time when time limit is reached
 * @param {boolean} maxPlayer if this is MAX or MIN
 */
const minimax = (
    state,
    depth,
    colour,
    endTime,
    heuristicFunction,
    alpha = -Infinity,
    beta = Infinity,
    maxPlayer = true
) => {
    // TODO: terminal node constraints: move limit or end state
    if (depth === 0 || new Date() >= endTime) {
        // perform heuristic on this state and return
        return { state: null, heuristic: heuristicFunction(state, colour) }
    }

    // If maxPlayer = true, it's the colour. If maxPlayer = false, it's the other colour
    const currentColour = maxPlayer ? colour : colour === 'b' ? 'w' : 'b'
    const resultingStates = generateAllBoardStates(currentColour, state)

    // sort states based on their 1-ply calculated heuristic value
    resultingStates.sort((a, b) => {
        const aHeuristic = heuristicFunction(a.state, colour)
        const bHeuristic = heuristicFunction(b.state, colour)
        // sort descending if maxPlayer, ascending if not maxPlayer
        return maxPlayer ? bHeuristic - aHeuristic : aHeuristic - aHeuristic
    })


    if (maxPlayer) {
        // choose max
        let maxValue = { state: null, heuristic: -Infinity, move: null }
        for (const resultingState of resultingStates) {
            const value = minimax(
                resultingState.state,
                depth - 1,
                colour,
                endTime,
                heuristicFunction,
                alpha,
                beta,
                false
            )
            if (value.heuristic > maxValue.heuristic) {
                maxValue.state = resultingState.state
                maxValue.move = resultingState.move
                maxValue.heuristic = value.heuristic
            }
            alpha = Math.max(alpha, value.heuristic)
            if (alpha >= beta) {
                break
            }
        }
        return maxValue
    } else {
        // choose min
        let minValue = { state: null, heuristic: Infinity, move: null }
        for (const resultingState of resultingStates) {
            const value = minimax(
                resultingState.state,
                depth - 1,
                colour,
                endTime,
                heuristicFunction,
                alpha,
                beta,
                true
            )
            if (value.heuristic < minValue.heuristic) {
                minValue.state = resultingState.state
                minValue.move = resultingState.move
                minValue.heuristic = value.heuristic
            }
            beta = Math.min(beta, value.heuristic)
            if (beta <= alpha) {
                break
            }
        }
        return minValue
    }
}

/**
 *
 * @param {Array} state state array
 * @param {string} colour colour of the MAX player: black or white ("w" || "b")
 * @param {number} timeLimit time limit (in miliseconds) for doing interative deepening search
 * @param {function} heuristicFunction heuristic function. Default to emilyHeuristic
 */
export const iterativeDeepeningSearch = (state, colour, timeLimit, heuristicFunction = emilyHeuristic) => {
    // Reduce timeLimit by 10 miliseconds to account for time going back up in DLS (minimax algorithm)
    timeLimit -= 5

    // Maximum depth to search in DLS (minimax algorithm)
    let maxDepth = 1

    // The best state to go to from the current state and its heuristic value
    let value = { state: null, heuristic: null }

    // Calculate when the search will run out of time
    const endTime = new Date(new Date().getTime() + timeLimit)

    do {
        // Perform minimax algorithm with maximum depth increased by 1 per iteration
        let result = minimax(state, maxDepth++, colour, endTime, heuristicFunction)

        if (new Date() >= endTime) {
            // If the search for this iteration runs out of time before it could finish,
            // return the best state in the previous iteration.
            return {state: value.state, move: value.move}
        } else {
            // Save the result of this iteration if the search still has time for another iteration
            value = result
        }
    } while (true)
}

// placeholder: return -10 to 10
// const exampleHeuristic = (state, colour) => {
//     return Math.floor(Math.random() * 20) - 10
// }
