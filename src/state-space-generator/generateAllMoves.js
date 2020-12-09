import getSingleMarbleMoves from './singleMarbleMoves'
import getMarbleGroupMoves from './multipleMarbleMoves'

// marble group size enum
const marbleGroupSize = Object.freeze({
    TWO: 0,
    THREE: 3
})

function getMovesString(moves) {
    let str = ''

    moves.forEach(move => {
        str += `${move}\n`
    })
    return str
}

export function generateAllMoves(colour) {
    const [singleMoveStates, singleMoves] = getSingleMarbleMoves(colour)
    const [doubleMoveStates, doubleMoves] = getMarbleGroupMoves(colour, marbleGroupSize.TWO)
    const [tripleMoveStates, tripleMoves] = getMarbleGroupMoves(colour, marbleGroupSize.THREE)

    const allStates = [...singleMoveStates, ...doubleMoveStates, ...tripleMoveStates]
    const allMoves = [...singleMoves, ...doubleMoves, ...tripleMoves]
    const validMoves = allMoves.filter(move => move !== undefined)

    return [allStates, getMovesString(validMoves)]
}
