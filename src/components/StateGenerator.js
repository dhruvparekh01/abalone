import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { generateAllMoves } from '../state-space-generator/generateAllMoves'
import { saveAs } from 'file-saver'
import { getStringifiedStates } from '../state-space-generator/commonFunctions'
import { validateGeneratedBoards } from '../ai'

const generatePossibleStates = (inputText) => {
    const parts = inputText.split('\n')
    // Take only 1st character which is colour code. (Second character is \r invisible on the console)
    const colour = parts[0].charAt(0)
    const inputCells = parts[1].split(',')

    localStorage.setItem('state', '')
    localStorage.setItem('inputCells', JSON.stringify(inputCells))

    const [states, moves] = generateAllMoves(colour)
    const statesStr = getStringifiedStates(states)

    validateGeneratedBoards(statesStr) // for validation

    return [statesStr, moves]
}

const saveToFile = (text, name) => {
    // Add a BOM
    var blob = new Blob(['\uFEFF' + text], {
        type: 'text/plain;charset=utf-16',
    })
    saveAs(blob, name)
}

const handleInputFileSelected = (event) => {
    for (const file of event.target.files) {
        const reader = new FileReader()
        reader.onload = (event) => {
            const [boardsStr, movesStr] = generatePossibleStates(
                event.target.result
            )

            // Save to file
            saveToFile(boardsStr, `${file.name.split('.')[0]}.board`)
            saveToFile(movesStr, `${file.name.split('.')[0]}.move`)
        }
        reader.readAsText(file)
    }
}

export const StateGenerator = () => {
    return (
        <Tooltip title="Import file for state generation" placement="left">
            <Button
                component="label"
                onChange={handleInputFileSelected}
            >
                <input
                    type="file"
                    accept=".input"
                    multiple
                    style={{ display: 'none' }}
                />
                {<FolderOpenIcon style={{ fontSize: 45 }} />}
            </Button>
        </Tooltip>
    )
}
