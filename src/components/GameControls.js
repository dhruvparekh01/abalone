import React from 'react'
import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import StopIcon from '@material-ui/icons/Stop'
import ReplayIcon from '@material-ui/icons/Replay'
import UndoIcon from '@material-ui/icons/Undo'
import SettingsIcon from '@material-ui/icons/Settings'
import Tooltip from '@material-ui/core/Tooltip'

export const GameControls = ({
    undoLastUserMove,
    restartGame,
    timerRunning,
    setTimerRunning,
    endGame,
    gameStarted,
    handleClickOpen,
    aiColour,
}) => {

    const handleRestartGame = () => {
        if (window.confirm('Restart game?')) {
            restartGame()
        }
    }

    const handleEndGame = () => {
        if (window.confirm('End game?')) {
            endGame()
        }
    }

    return (
        <div id="controls">
            <Tooltip title="Resume game">
                <Button
                    component="span"
                    disabled={!gameStarted || timerRunning}
                    onClick={() => setTimerRunning(true)}
                >
                    {<PlayArrowIcon style={{ fontSize: 45 }} />}
                </Button>
            </Tooltip>

            <Tooltip title="Pause game">
                <Button
                    component="span"
                    disabled={!gameStarted || !timerRunning}
                    onClick={() => setTimerRunning(false)}
                >
                    {<PauseIcon style={{ fontSize: 45 }} />}
                </Button>
            </Tooltip>

            <Tooltip title="End game">
                <Button
                    component="span"
                    disabled={!gameStarted}
                    onClick={() => handleEndGame()}
                >
                    {<StopIcon style={{ fontSize: 45 }} />}
                </Button>
            </Tooltip>

            <Tooltip title="Restart game">
                <Button component="span" onClick={handleRestartGame}>
                    <ReplayIcon style={{ fontSize: 45 }} />
                </Button>
            </Tooltip>

            <Tooltip title="Undo last move">
                <Button
                    component="span"
                    id="undo"
                    disabled={!gameStarted || !aiColour} // disable undo if human vs human
                    onClick={undoLastUserMove}
                >
                    {<UndoIcon style={{ fontSize: 45 }} />}
                </Button>
            </Tooltip>

            <Tooltip title="Open settings">
                <Button
                    component="span"
                    disabled={gameStarted}
                    onClick={handleClickOpen}
                >
                    {<SettingsIcon style={{ fontSize: 45 }} />}
                </Button>
            </Tooltip>
        </div>
    )
}
