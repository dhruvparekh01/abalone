import React, { useEffect, useState } from 'react'
import { validateSelection } from '../user-moves/multipleMarbleMoves'
// import { moveMarbleUser } from '../user-moves/singleMarbleMoves'
// import { colourValNumToLetter } from '../state-space-generator/commonFunctions'

export const Space = ({ rowIndex, spaceIndex, selected, setSelected, turn, gameBoard }) => {
    const letters = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']
    // Boolean for whether the current space is selected for a move
    const [isSelected, setIsSelected] = useState(false)
    const colour = gameBoard[rowIndex][spaceIndex]

    // Every time the "selected" array changes, update the isSelected state
    useEffect(() => {
        // TODO: Try and get rid of this step
        // Every time the 'selected' parent state changes, check if the current marble is
        // in it or not and set the isSelected variable accordingly
        if (selected.find(marble => marble[0] === rowIndex && marble[1] === spaceIndex)) {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowIndex, spaceIndex, selected])

    const calculateCoordinates = () => {
        const letter = letters[rowIndex]
        const number = spaceIndex + 1
        return `${letter}${number}`
    }

    const renderSpaceContents = () => {
        return colour !== 1 ? (
            <div className={`filledSpace ${colour === 2 ? 'whiteSpace' : 'blackSpace'} ${isSelected ? 'selected' : ''}`}>
                <h2 className="spaceCoordinate">{calculateCoordinates()}</h2>
            </div>
        ) : (
            <h2 className="spaceCoordinate">{calculateCoordinates()}</h2>
        )
    }

    /**
     * Handle user clicking on this space
     */
    function handleSelect() {

        // If user clicks on an already selected marble, empty the selected array
        if (isSelected) {
            setSelected([])
            return
        }

        // For odd turn counts, only let the black make moves
        if (turn === 'b' && colour === 2) {
            return
        }

        // For odd turn counts, only let the white make moves
        if (turn === 'w' && colour === 3) {
            return
        }

        // If there is no currently selected marble, select this one
        if (selected.length === 0 && colour !== 0 && colour !== 1) {
            setSelected([...selected, [rowIndex, spaceIndex]])
        }
        
        // If there is space left in the selected array, check if the selection
        // is valid and add to list if it is
        else if (selected.length === 1 || selected.length === 2) {
            if (validateSelection([...selected, [rowIndex, spaceIndex]], gameBoard)) {
                setSelected([...selected, [rowIndex, spaceIndex]])
            }
        }
        // Trying to select more than 3 marbles, do nothing
        else {
            return
        }
    }

    // function handleMove() {
    //     const colour = colourValNumToLetter[gameBoard[selected[0][0]][selected[0][1]]]
    //     if (selected.length === 1) {
    //         const newGameBoard = moveMarbleUser(selected[0], [rowIndex, spaceIndex], colour, gameBoard)
    //         setSelected([])
    //         setGameBoard(newGameBoard)
    //     }
    // }

    // /**
    //  * Function to handle user click on the current marble. Can either move the marble to the new position
    //  * or add it to the list of selected marbles
    //  */
    // function handleClick() {
    //     // If there is no marble currently selected, add this marble to selected
    //     if (selected.length === 0) {
    //         handleSelect()
    //         return
    //     }
    //     const colour = gameBoard[rowIndex][spaceIndex]
    //     const selectedColour = gameBoard[selected[0][0]][[selected[0][1]]]

    //     // console.log(colour);
    //     // console.log(selectedColour);
    //     // console.log(gameBoard);

    //     // If a new marble selected is the same color as currently selected marbles, try to add it to selected
    //     if (colour === selectedColour) {
    //         // console.log("handle select");
    //         handleSelect()
    //     } 
    //     // If the cell is empty, try to move
    //     else if (colour === 1) {
    //         handleMove()
    //     }
    // }

    return (
        <div className="space" onClick={handleSelect}>
            {renderSpaceContents()}
        </div>
    )
}
