import React from 'react'
import ArrowIcon from '@material-ui/icons/ArrowLeft'

export function Score({ score, turn }) {
    const { w, b } = score

    const renderScore = (colour) => {
        const scoreMarbles = colour === 'w' ? w : b
        return (
            <div
                className={`scoreContainer ${
                    scoreMarbles > 5
                        ? 'scoreContainerFull'
                        : 'scoreContainerNotFull'
                }`}
            >
                {[...Array(scoreMarbles)].map((e, i) => (
                    <div
                        key={i}
                        className={`scoreMarble scoreMarble${
                            colour === 'w' ? 'Black' : 'White'
                        }`}
                    ></div>
                ))}
            </div>
        )
    }

    return (
        <div id="score">
            <div className="scoreHeader scoreHeaderBlack">
                <span>Black</span>
                {turn === 'b' && <ArrowIcon />}
            </div>
            {renderScore('b')}
            <div className='scoreHeader scoreHeaderWhite'>
                <span>White</span>
                {turn === 'w' && <ArrowIcon />}
            </div>
            {renderScore('w')}
        </div>
    )
}

