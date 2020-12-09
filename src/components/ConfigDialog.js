import { useState, useEffect, forwardRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import MenuItem from '@material-ui/core/MenuItem'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { StateGenerator } from './StateGenerator'
import { GAME_STATES } from './constants'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        padding: '0.5em 0.5em 0 0.5em',
    },
    paper: {
        minWidth: '50%',
    },
}))

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const ConfigDialog = ({
    open,
    handleClose,
    setHumanColour,
    setAiColour,
    humanColour,
    startGame,
    setGameBoard,
    moveLimit,
    setMoveLimit,
    timeLimits,
    setTimeLimits,
    setAiTimeLimit,
}) => {
    const [gameMode, setGameMode] = useState('humanVsAi')
    const [boardConfig, setBoardConfig] = useState(0)

    const selectColour = () => {
        function handleChange(colour) {
            setHumanColour(colour)
        }
        return (
            <div>
                <TextField
                    value={humanColour}
                    variant="outlined"
                    fullWidth
                    select
                    disabled={gameMode === 'humanVsHuman'}
                    onChange={(event) => handleChange(event.target.value)}
                >
                    <MenuItem value="b">Black</MenuItem>
                    <MenuItem value="w">White</MenuItem>
                </TextField>
            </div>
        )
    }

    const selectPlayerMode = () => {
        function handleChange(mode) {
            setGameMode(mode)
        }

        return (
            <div>
                <TextField
                    value={gameMode}
                    variant="outlined"
                    fullWidth
                    select
                    onChange={(event) => handleChange(event.target.value)}
                >
                    <MenuItem value='humanVsAi'>Human vs AI</MenuItem>
                    <MenuItem value='humanVsHuman'>Human vs human</MenuItem>
                </TextField>
            </div>
        )
    }

    const selectGameBoard = () => {
        function handleChange(boardIndex) {
            setBoardConfig(boardIndex)
            setGameBoard(GAME_STATES[boardIndex])
        }

        return (
            <>
                <TextField
                    value={boardConfig}
                    variant="outlined"
                    fullWidth
                    select
                    onChange={(event) => handleChange(event.target.value)}
                >
                    <MenuItem value={0}>Default</MenuItem>
                    <MenuItem value={1}>Belgian Daisy</MenuItem>
                    <MenuItem value={2}>German Daisy</MenuItem>
                </TextField>
            </>
        )
    }

    const selectMoveTimeLimit = (colour) => {
        function changeTimeLimit(event) {
            const value = event.target.value
            setTimeLimits({
                ...timeLimits,
                [colour]: parseFloat(value)
            })
        }

        return (
            <TextField
                type="number"
                value={timeLimits[colour]}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {
                        min: 1,
                    },
                }}
                onChange={changeTimeLimit}
            />
        )
    }

    const selectMoveLimit = () => {
        function changeMoveLimit(event) {
            const value = event.target.value
            setMoveLimit(value)
        }
        return (
            <TextField
                type="number"
                variant="outlined"
                value={moveLimit}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {
                        min: 1,
                    },
                }}
                onChange={changeMoveLimit}
            />
        )
    }

    const setUpAi = () => {
        if (gameMode === 'humanVsAi') {
            const aiColour = humanColour === 'b' ? 'w' : 'b'
            setAiTimeLimit(timeLimits[aiColour])
            setAiColour(aiColour);
        }
    }


    const handleStartGame = () => {
        setUpAi()
        handleClose()
        startGame()
    }

    useEffect(() => {
        if (gameMode === 'humanVsAi') {
            const aiColour = humanColour === 'b' ? 'w' : 'b'
            setAiColour(aiColour);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [humanColour])

    useEffect(() => {
        // when in humanVsHuman, ai colour = null
        if (gameMode === 'humanVsHuman') {
            setAiColour(null); // nullify ai colour to turn off ai reactions
        } else {
            // otherwise, set ai colour to opposite of human colour
            const aiColour = humanColour === 'b' ? 'w' : 'b'
            setAiColour(aiColour)
            setAiTimeLimit(timeLimits[aiColour])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameMode])

    const classes = useStyles()
    return (
        <Dialog
            classes={{ paper: classes.paper }}
            maxWidth={'md'}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            disableBackdropClick
        >
            <DialogTitle className={classes.title} onClose={handleClose}>
                <div id="configDiaglogTitleContainer">
                    <h1 id="configDialogTitle">Abalone Options</h1>
                    <StateGenerator />
                </div>
            </DialogTitle>

            <div id="configDialogContainer">
                <List>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary="Starting Position"
                            secondary={selectGameBoard()}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary="Human player colour"
                            secondary={selectColour()}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary="Game Mode"
                            secondary={selectPlayerMode()}
                        />
                    </ListItem>
                </List>
                <List>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary="Move limit"
                            secondary={selectMoveLimit()}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary="Black move time limit (seconds)"
                            secondary={selectMoveTimeLimit('b')}
                        />
                    </ListItem>
                    <ListItem button>
                        <ListItemText
                            disableTypography
                            primary="White move time limit (seconds)"
                            secondary={selectMoveTimeLimit('w')}
                        />
                    </ListItem>
                </List>
            </div>
            <Button variant="contained" onClick={handleStartGame}>
                Start Game
            </Button>
        </Dialog>
    )
}
