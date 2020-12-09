// import minimax from './minimax';

// Perform iterative deepening search with time limit in miliseconds
// export const iterativeDeepeningSearch = (state, curPlayer, timeLimit) => {
//   const start = new Date();
//   const isTimeOut = () => new Date() - start > timeLimit;
//   let depth = 1;
//   let eval;
//   do {
//     eval = minimax(state, depth++, -Infinity, Infinity, curPlayer);
//   } while (!isTimeOut() && (eval > 1 || eval < -1));
//   return eval;
// }

// iterativeDeepeningSearch([1,2,3,4], 'b', 5000);
