import React from 'react'
import { GameControls } from './GameControls'

export default function Header({
    setConfigOpen,
    undoLastUserMove,
    restartGame,
    winState,
    timerRunning,
    setTimerRunning,
    endGame,
    gameStarted,
    aiColour
}) {

    const handleClickOpen = () => {
        setConfigOpen(true)
        restartGame()
    }

    const getWinnerDisplay = () => {
        const { winner, message } = winState
        // null - no winner
        // w - white
        // b - black
        // tie - tie
        if (winner !== null) {
            let result
            let winnerStyle
            if (winner === 'w') {
                result = 'White wins!'
                winnerStyle = 'winnerWhite'
            } else if (winner === 'b') {
                result = 'Black wins!'
                winnerStyle = 'winnerBlack'
            } else {
                result = 'It\'s a tie!'
                winnerStyle = 'winnerTie'
            }
            return (
                <div className='winHeader'>
                    {!!message && <span>{message}</span>}
                    <h2 id='winner' className={winnerStyle}>{result}</h2>
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <>
            <div id="header">
                <h1 id="headerText">Abalone</h1>
                {getWinnerDisplay()}
                <GameControls
                    restartGame={restartGame} 
                    undoLastUserMove={undoLastUserMove}
                    timerRunning={timerRunning}
                    setTimerRunning={setTimerRunning}
                    endGame={endGame}
                    gameStarted={gameStarted}
                    handleClickOpen={handleClickOpen}
                    aiColour={aiColour}
                />
            </div>
        </>
    )
}
