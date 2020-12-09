import React, { useEffect, useState } from 'react'
import { Board } from './Board'
import { History } from './History'
import { Score } from './Score'
import { TimerAndMoves } from './TimerAndMoves'
import { ConfigDialog } from './ConfigDialog'
import Header from './Header'
import { iterativeDeepeningSearch, generateAllBoardStates } from '../ai'
import { moveMarbleUserDirection } from '../user-moves/singleMarbleMoves'
import { moveMarbleGroup } from '../user-moves/multipleMarbleMoves'
import {
    moveType,
    moveDirection,
    colourValNumToLetter,
} from '../state-space-generator/commonFunctions'
import {
    DEFAULT_AI_COLOUR,
    DEFAULT_HUMAN_COLOUR,
    DEFAULT_GAME_STATE,
    DEFAULT_MOVE_LIMIT,
    DEFAULT_TIME_LIMIT,
    GAME_STATES,
    STARTING_COLOUR,
    STARTING_MOVE_COUNTS,
    STARTING_MOVE_TIMES,
    STARTING_TIME_LIMITS,
    STARTING_WIN_STATE,
    WINNING_SCORE,
    MAXIMUM_MARBLES,
} from './constants'

export const Game = () => {
    const calculateScore = (state) => {
        let whiteMarbles = 0
        let blackMarbles = 0
        state.forEach((row) => {
            row.forEach((space) => {
                if (space === 2) {
                    whiteMarbles++
                } else if (space === 3) {
                    blackMarbles++
                }
            })
        })
        return {
            w: MAXIMUM_MARBLES - blackMarbles,
            b: MAXIMUM_MARBLES - whiteMarbles,
        }
    }

    // game setup states
    const [humanColour, setHumanColour] = useState(DEFAULT_HUMAN_COLOUR)
    const [aiColour, setAiColour] = useState(DEFAULT_AI_COLOUR)
    const [gameBoard, setGameBoard] = useState(GAME_STATES[DEFAULT_GAME_STATE])
    const [moveLimit, setMoveLimit] = useState(DEFAULT_MOVE_LIMIT)

    // moving marbles state
    const [selected, setSelected] = useState([])

    // gameplay states
    const [turn, setTurn] = useState(DEFAULT_HUMAN_COLOUR)
    const [history, setHistory] = useState([])
    const [score, setScore] = useState(calculateScore(gameBoard))
    const [lastMoveTimes, setLastMoveTimes] = useState(STARTING_MOVE_TIMES)
    const [moveCounts, setMoveCounts] = useState(STARTING_MOVE_COUNTS)

    // time states
    const [totalTime, setTotalTime] = useState(STARTING_MOVE_TIMES)
    const [aiTimeLimit, setAiTimeLimit] = useState(DEFAULT_TIME_LIMIT) // only used in human vs ai
    const [timeLimits, setTimeLimits] = useState(STARTING_TIME_LIMITS)
    const [timeRemaining, setTimeRemaining] = useState(timeLimits.b) // start with black
    const [timerRunning, setTimerRunning] = useState(false)

    // game over states
    const [winState, setWinState] = useState(STARTING_WIN_STATE)
    const [gameStarted, setGameStarted] = useState(false)

    // dialog state
    const [configOpen, setConfigOpen] = useState(true)

    // Set the 1st element in history to be the starting game board and empty move
    useEffect(() => {
        if (history.length <= 1) {
            setHistory([[gameBoard, null]])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameBoard])

    // Handle AI reactions
    useEffect(() => {
        console.log('turn flipping')
        // setScore(calculateScore(gameBoard))
        if (gameStarted) {
            if (!checkGameOver()) {
                setTimeout(() => {
                    if (turn === aiColour) {
                        generateAiMove()
                    }
                }, 5)
                setTimeRemaining(timeLimits[turn])
                incrementMoveCount(turn)
            } else {
                handleGameOver()
            }
            setTimerRunning(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn])

    // Handle game over when either score reaches 6
    useEffect(() => {
        if (score.b >= WINNING_SCORE) {
            handleGameOver(`Black pushed ${WINNING_SCORE} white marbles pushed off.`, 'b')
        } else if (score.w >= WINNING_SCORE) {
            handleGameOver(`White pushed ${WINNING_SCORE} black marbles pushed off.`, 'w')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score])

    // Handle game over when move limit(s) reached
    useEffect(() => {
        if (moveCounts.w >= moveLimit && moveCounts.b >= moveLimit) {
            let winner
            if (score.w > score.b) {
                winner = 'w'
            } else if (score.b > score.w) {
                winner = 'b'
            } else {
                winner = 'tie'
            }
            handleGameOver(
                'Game over, move limit reached for both players.',
                winner
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moveCounts])

    const generateAiMove = () => {
        const before = new Date().getTime()
        const { state, move } = iterativeDeepeningSearch(
            gameBoard,
            aiColour,
            aiTimeLimit * 1000
        )
        setGameBoard(state)
        setTurn(humanColour)
        const after = new Date().getTime()
        move.time = (after - before) / 1000.0
        move.colour = aiColour
        addTotalTime(aiColour, move.time)
        setLastMoveTimes({
            ...lastMoveTimes,
            [aiColour]: move.time,
        })
        addToHistory(state, move)
        console.log(`AI Move took ${after - before} milliseconds`)
        setScore(calculateScore(state))
    }

    const incrementMoveCount = (colour) => {
        setMoveCounts({
            ...moveCounts,
            [colour]: moveCounts[colour] + 1,
        })
    }

    function undoLastUserMove() {
        if (history.length > 1) {
            setTimeRemaining(timeLimits[humanColour])
            setTimerRunning(true)
            setGameBoard(history[history.length - 3][0])
            setHistory([...history.slice(0, history.length - 2)])
            setMoveCounts({
                w: moveCounts.w - 1,
                b: moveCounts.b - 1,
            })
            setTotalTime({
                w: totalTime.w - lastMoveTimes.w,
                b: totalTime.b - lastMoveTimes.b,
            })
        }
    }

    function addTotalTime(colour, time) {
        if (colour === 'w') {
            setTotalTime({
                ...totalTime,
                w: totalTime.w + time,
            })
        } else {
            setTotalTime({
                ...totalTime,
                b: totalTime.b + time,
            })
        }
    }

    function addToHistory(state, move) {
        setHistory([...history, [state, move]])
    }

    // generate random move for black (AI) player and set the state
    const generateRandomBlackAiMove = () => {
        const before = new Date().getTime()
        const states = generateAllBoardStates('b', gameBoard)
        const randomIndex = Math.floor(Math.random() * states.length)
        setGameBoard(states[randomIndex].state)
        const move = states[randomIndex].move
        const after = new Date().getTime()
        move.time = (after - before) / 1000
        setLastMoveTimes({
            ...lastMoveTimes,
            [aiColour]: move.time,
        })
        addTotalTime(aiColour, move.time)
        addToHistory(states[randomIndex].state, states[randomIndex].move)
        setTurn('w')
    }

    const startGame = () => {
        setTimerRunning(true)
        if (aiColour === 'b') {
            generateRandomBlackAiMove()
        } else {
            setTimeRemaining(timeLimits.b)
        }
        setGameStarted(true)
    }

    /**
     * Determine, based on the selected marbles from the state, if the attempted move is inline or side move
     * @param {moveDirection} direction The direction that the user wants to move to
     * @returns {moveType} INLINE || SIDE
     */
    function getMoveType(direction) {
        const rows = selected.map((marble) => marble[0])
        const cols = selected.map((marble) => marble[1])

        const minRow = Math.min(...rows)
        const maxRow = Math.max(...rows)

        const minCol = Math.min(...cols)
        const maxCol = Math.max(...cols)

        // Check if the 3 marbles make a horizontal line formation
        const isHorizontal = maxRow === minRow

        if (isHorizontal) {
            if (
                direction === moveDirection.E ||
                direction === moveDirection.W
            ) {
                return moveType.INLINE
            } else {
                return moveType.SIDE
            }
        } else {
            // Min col == max col => NW - SE alignment of marbles
            if (minCol === maxCol) {
                if (
                    direction === moveDirection.NW ||
                    direction === moveDirection.SE
                ) {
                    return moveType.INLINE
                } else {
                    return moveType.SIDE
                }
            } else {
                if (
                    direction === moveDirection.NE ||
                    direction === moveDirection.SW
                ) {
                    return moveType.INLINE
                } else {
                    return moveType.SIDE
                }
            }
        }
    }

    /**
     * Move selected marbles in the given direction if valid move else empty the selected array
     * @param {moveDirection} direction Direction of the attempted move
     */
    function moveMarbles(direction) {
        const type = getMoveType(direction)
        const colour =
            colourValNumToLetter[gameBoard[selected[0][0]][selected[0][1]]]
        const move = { marbles: selected, direction: direction }

        let newGameBoard
        let marbleMoved = false

        if (selected.length === 1) {
            ;[newGameBoard, marbleMoved] = moveMarbleUserDirection(
                selected[0],
                direction,
                colour,
                gameBoard
            )
        } else {
            ;[newGameBoard, marbleMoved] = moveMarbleGroup(
                selected,
                direction,
                type,
                colour,
                gameBoard
            )
        }

        if (marbleMoved) {
            const timeTaken = timeLimits[turn] - timeRemaining
            move.time = timeTaken
            move.colour = turn
            addTotalTime(move.colour, move.time)
            setLastMoveTimes({
                ...lastMoveTimes,
                [move.colour]: move.time,
            })
            setTurn(turn === 'w' ? 'b' : 'w')
            addToHistory(gameBoard, move)
            setScore(calculateScore(newGameBoard))
        }

        setGameBoard(newGameBoard)
        setSelected([])
    }

    const handleGameOver = (message = null, winner = null) => {
        setTimerRunning(false)
        setGameStarted(false)
        if (!!winner) {
            setWinState({ winner: winner, message: message })
        } else {
            if (score.w > score.b) {
                setWinState({ winner: 'w', message: message })
            } else if (score.b > score.w) {
                setWinState({ winner: 'b', message: message })
            } else {
                setWinState({ winner: 'tie', message: message })
            }
        }
    }

    const checkGameOver = () => {
        if (moveCounts.b >= moveLimit && moveCounts.w >= moveLimit) {
            return true
        } else if (score.b >= WINNING_SCORE || score.w >= WINNING_SCORE) {
            return true
        } else {
            return false
        }
    }

    const handleRestartGame = () => {
        setGameStarted(false)

        // reset everything back to default
        setHistory([])
        setHumanColour(DEFAULT_HUMAN_COLOUR)
        setAiColour(DEFAULT_AI_COLOUR)
        setGameBoard(GAME_STATES[DEFAULT_GAME_STATE])
        setSelected([])
        setTurn(STARTING_COLOUR)
        setScore(calculateScore(gameBoard))
        setLastMoveTimes(STARTING_MOVE_TIMES)
        setMoveCounts(STARTING_MOVE_COUNTS)
        setMoveLimit(DEFAULT_MOVE_LIMIT)
        setTimeRemaining(DEFAULT_TIME_LIMIT)
        setTimeLimits(STARTING_TIME_LIMITS)
        setWinState(STARTING_WIN_STATE)

        // turn game over state off
        setGameStarted(false)
        setTimerRunning(false)
        // reopen config dialog
        setConfigOpen(true)
    }

    const handleEndGame = () => {
        setGameStarted(false)
        handleGameOver('Game over.')
    }

    return (
        <>
            <Header
                setConfigOpen={setConfigOpen}
                undoLastUserMove={undoLastUserMove}
                restartGame={handleRestartGame}
                winState={winState}
                timerRunning={timerRunning}
                setTimerRunning={setTimerRunning}
                endGame={handleEndGame}
                gameStarted={gameStarted}
                aiColour={aiColour}
            />

            <div className="gameplay">
                <Board
                    gameBoard={gameBoard}
                    selected={selected}
                    turn={turn}
                    aiColour={aiColour}
                    setGameBoard={setGameBoard}
                    setSelected={setSelected}
                    addToHistory={addToHistory}
                    moveMarbles={moveMarbles}
                    gameStarted={gameStarted}
                    timerRunning={timerRunning}
                />
                <div className="sidebar">
                    <TimerAndMoves
                        moveLimit={moveLimit}
                        running={timerRunning}
                        setRunning={setTimerRunning}
                        turn={turn}
                        setTurn={setTurn}
                        timeRemaining={timeRemaining}
                        setTimeRemaining={setTimeRemaining}
                        incrementMoveCount={incrementMoveCount}
                    />
                    <Score score={score} turn={turn} />
                    <History
                        history={history}
                        totalTime={totalTime}
                        moveCounts={moveCounts}
                    />
                </div>
            </div>
            <ConfigDialog
                open={configOpen}
                setHumanColour={setHumanColour}
                setAiColour={setAiColour}
                humanColour={humanColour}
                startGame={startGame}
                setGameBoard={setGameBoard}
                moveLimit={moveLimit}
                setMoveLimit={setMoveLimit}
                timeLimits={timeLimits}
                aiTimeLimit={aiTimeLimit}
                setAiTimeLimit={setAiTimeLimit}
                setTimeLimits={setTimeLimits}
                handleClose={() => setConfigOpen(false)}
            />
        </>
    )
}
