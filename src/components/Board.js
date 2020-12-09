import React from 'react'
import { Space } from './Space'
import { moveDirection } from '../state-space-generator/commonFunctions'
import NorthEastIcon from '@material-ui/icons/NorthEast'
import EastIcon from '@material-ui/icons/East'
import SouthEastIcon from '@material-ui/icons/SouthEast'
import SouthWestIcon from '@material-ui/icons/SouthWest'
import WestIcon from '@material-ui/icons/West'
import NorthWestIcon from '@material-ui/icons/NorthWest'
import Tooltip from '@material-ui/core/Tooltip'

export const Board = ({
    gameBoard,
    selected,
    turn,
    aiColour,
    setSelected,
    moveMarbles,
    gameStarted,
    timerRunning
}) => {

    const isBoardDisabled = () => {
        return !gameStarted || !timerRunning
    }

    const areControlsDisabled = () => {
        return !gameStarted || !turn === aiColour || !timerRunning || selected.length < 1
    }

    return (
        <div id="playArea">
            <div className={`board ${isBoardDisabled() ? 'clicksDisabled' : ''}`}>
                {gameBoard.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="row">
                        {row.map(
                            (space, spaceIndex) =>
                                space !== 0 && (
                                    <Space
                                        key={`row-${rowIndex}-space-${spaceIndex}`}
                                        rowIndex={rowIndex}
                                        spaceIndex={spaceIndex}
                                        selected={selected}
                                        setSelected={setSelected}
                                        turn={turn}
                                        gameBoard={gameBoard}
                                    />
                                )
                        )}
                    </div>
                ))}
            </div>
            <div
                id="moves"
                className={areControlsDisabled() ? 'clicksDisabled' : ''}
            >
                <div>
                    <Tooltip title="Move Northwest">
                        <NorthWestIcon
                            onClick={() => moveMarbles(moveDirection.NW)}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Move Northeast">
                        <NorthEastIcon
                            onClick={() => moveMarbles(moveDirection.NE)}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Move West">
                        <WestIcon
                            onClick={() => moveMarbles(moveDirection.W)}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Move East">
                        <EastIcon
                            onClick={() => moveMarbles(moveDirection.E)}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Move Southwest">
                        <SouthWestIcon
                            onClick={() => moveMarbles(moveDirection.SW)}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Move Southeast">
                        <SouthEastIcon
                            onClick={() => moveMarbles(moveDirection.SE)}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
