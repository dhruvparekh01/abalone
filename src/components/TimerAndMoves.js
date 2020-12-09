import { useEffect } from 'react'

export const TimerAndMoves = ({
    moveLimit,
    running,
    setRunning,
    timeRemaining,
    setTimeRemaining,
    setTurn,
    turn,
}) => {
    useEffect(() => {
        if (running) {
            if (timeRemaining > 0.2) {
                const timer = setTimeout(() => {
                    setTimeRemaining(timeRemaining - 0.1)
                }, 100)
                // Clear timeout if the component is unmounted
                return () => clearTimeout(timer)
            } else {
                console.log('Time is up!')
                setRunning(false)
                setTimeRemaining(0)
                setTurn(turn === 'b' ? 'w' : 'b')
            }
        }
    })

    return (
        <div id="timerAndMoveLimit">
            <h4>
                Timer:{' '}
                <span className={timeRemaining < 5 ? 'timerRed' : ''}>
                    {timeRemaining === Infinity ? '--' : `${timeRemaining.toFixed(1)}s`}
                </span>
            </h4>
            <h4>Move limit: {moveLimit === Infinity ? '--' : moveLimit}</h4>
        </div>
    )
}
