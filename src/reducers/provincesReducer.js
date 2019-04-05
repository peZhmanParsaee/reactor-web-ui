import * as TYPES from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.SET_PROVINCES:
      return action.provinces;
    default:
      return state;
  }
}


// import {
//   SET_PROVINCES,
//   API_START,
//   API_END,
//   FETCH_PROVINCES
// } from "../actions/types";

// export default function(state = {}, action) {
//   console.log("action type => ", action.type);
//   switch (action.type) {
//     case SET_PROVINCES:
//       console.log(`SET_PROVINCES action is ${JSON.stringify(action)}`); 
//       return { data: action.payload };
//     case API_START:
//       console.log(`API_START action is ${JSON.stringify(action)}`); 
//       if (action.payload === FETCH_PROVINCES) {
//         return {
//           ...state,
//           isLoadingData: true
//         };
//       }
//       break;
//     case API_END:
//       console.log(`API_END action is ${JSON.stringify(action)}`); 
//       if (action.payload === FETCH_PROVINCES) {
//         return {
//           ...state,
//           isLoadingData: false
//         };
//       }
//       break;
//     default:
//       return state;
//   }
// }
