import NorthEastIcon from '@material-ui/icons/NorthEast';
import EastIcon from '@material-ui/icons/East';
import SouthEastIcon from '@material-ui/icons/SouthEast';
import SouthWestIcon from '@material-ui/icons/SouthWest';
import WestIcon from '@material-ui/icons/West';
import NorthWestIcon from '@material-ui/icons/NorthWest';
import HistoryEduIcon from '@material-ui/icons/HistoryEdu';
import TimerIcon from '@material-ui/icons/Timer';

export const History = ({ history, totalTime, moveCounts }) => {
    const letters = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const directions = [
        <NorthEastIcon/>,
        <EastIcon/>,
        <SouthEastIcon/>,
        <SouthWestIcon/>,
        <WestIcon/>,
        <NorthWestIcon/>
    ];

    function getMovesFromHistory() {
        if (history.length > 0) {
            return history.filter(step => step[1] !== null).map(step => step[1])
        } else {
            return []
        }
    }

    const renderMoves = () => {
        const historyMoves = getMovesFromHistory()
        if (historyMoves.length > 0) {
            const moves = historyMoves.reverse().map((move, moveIndex) => {
                const { marbles, direction, time } = move

                const marbleList = marbles.map(([row, col], marbleIndex) => {
                    const key = `marble-${marbleIndex}`;
                    const color = (move.colour === 'w') ? 'whiteSpace historyMarbleWhite' : 'blackSpace'
                    return (
                        <span key={key} className={`marble ${color}`}>
                            {`${letters[row]}${col + 1}`}
                        </span>
                    );
                });
        
                return (
                    <li key={`move-${moveIndex}`}>
                        <div className='move-container'>
                            {marbleList}
                            <span className='direction'>{directions[direction]}</span>
                        </div>
                        <TimerIcon/>
                        {time.toFixed(2)}s
                    </li>
                );
            });
            return moves
        } else {
            return null
        }
    }

    return (
        <div className='history'>
            <h3>
                <HistoryEduIcon/>
                Moves taken:
            </h3>
            <hr />

            <div id="timeAndMoves">
                <h4 id="totalTimeLabel">Total time:</h4>
                <h4 id="totalMovesLabel">Total moves:</h4>
                <span id="blackMarbleLabel" className='marble blackSpace'>B</span>
                <span id="whiteMarbleLabel" className='marble whiteSpace historyMarbleWhite'>W</span>
                <span id="totalTimeBlack">{totalTime.b.toFixed(2)}s</span>
                <span id="totalTimeWhite">{totalTime.w.toFixed(2)}s</span>
                <span id="totalMovesBlack">{moveCounts.b}</span>
                <span id="totalMovesWhite">{moveCounts.w}</span>
            </div>

            <h4>Details:</h4>
            <ul id="movesHistory">{renderMoves()}</ul>
        </div>
    );
}
