import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import bladesReducer from './bladesReducer';

const rootReducer = combineReducers({
    blades: bladesReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export default store;