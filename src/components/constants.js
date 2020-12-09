export const GAME_STATES = [
  [
      [0, 0, 0, 0, 2, 2, 2, 2, 2],
      [0, 0, 0, 2, 2, 2, 2, 2, 2],
      [0, 0, 1, 1, 2, 2, 2, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 3, 3, 3, 1, 1, 0, 0],
      [3, 3, 3, 3, 3, 3, 0, 0, 0],
      [3, 3, 3, 3, 3, 0, 0, 0, 0],
  ],
  [
      [0, 0, 0, 0, 2, 2, 1, 3, 3],
      [0, 0, 0, 2, 2, 2, 3, 3, 3],
      [0, 0, 1, 2, 2, 1, 3, 3, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 3, 3, 1, 2, 2, 1, 0, 0],
      [3, 3, 3, 2, 2, 2, 0, 0, 0],
      [3, 3, 1, 2, 2, 0, 0, 0, 0],
  ],
  [
      [0, 0, 0, 0, 1, 1, 1, 1, 1],
      [0, 0, 0, 2, 2, 1, 1, 3, 3],
      [0, 0, 2, 2, 2, 1, 3, 3, 3],
      [0, 1, 2, 2, 1, 1, 3, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 3, 3, 1, 1, 2, 2, 1, 0],
      [3, 3, 3, 1, 2, 2, 2, 0, 0],
      [3, 3, 1, 1, 2, 2, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0],
  ],
]

export const DEFAULT_AI_COLOUR = 'w'
export const DEFAULT_HUMAN_COLOUR = 'b'
export const DEFAULT_GAME_STATE = 0
export const DEFAULT_MOVE_LIMIT = 40
export const DEFAULT_TIME_LIMIT = 10.0
export const MAXIMUM_MARBLES = 14
export const STARTING_COLOUR = 'b'
export const STARTING_MOVE_TIMES = { b: 0.0, w: 0.0 }
export const STARTING_MOVE_COUNTS = { b: 0, w: 0 }
export const STARTING_TIME_LIMITS = { b: DEFAULT_TIME_LIMIT, w: DEFAULT_TIME_LIMIT }
export const STARTING_WIN_STATE = { message: null, winner: null }
export const WINNING_SCORE = 6
