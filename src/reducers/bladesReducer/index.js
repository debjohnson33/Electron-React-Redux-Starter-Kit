import { ADD_BLADE, FETCH_BLADES } from '../../actions/types';

const INITIAL_STATE = {
    arr: [],
    latestBlade: {}
};

export default (state = INITIAL_STATE, action) => {

    switch(action.type){
        case ADD_BLADE:
            return {...state, arr: action.payload.blades, latestBlade: action.payload.newBlade}
        case FETCH_BLADES:
            return {...state, arr: action.payload}
        default: 
            return state;
    }
}