import { ADD_BLADE, FETCH_BLADES, SAVE_BLADE, DELETE_BLADE } from './types';
import electron from 'electron';

const { ipcRenderer } = electron;

export const addBlade = blade => dispatch => {

    ipcRenderer.send('addBlade', blade);
    ipcRenderer.on('blade:added', (event, blades, newBlade) => {

        var tempObj = {
            blades,
            newBlade
        }

        dispatch({
            type: ADD_BLADE,
            payload: tempObj
        });
    });

};

export function fetchBlades() {
    return dispatch => {
        ipcRenderer.send('fetchBlades');
        ipcRenderer.on('fetched:blades', (event, blades) => {
            dispatch({
                type: FETCH_BLADES,
                payload: blades
            });
        });
    }

}

export function saveBlade(blade) {
    return dispatch => {
        ipcRenderer.send('saveBlade', blade);
        ipcRenderer.on('blade:saved', (event, blades) => {
            dispatch({
                type: FETCH_BLADES,
                payload: blades
            });
        });
    }
}

export function deleteBlade(_id){
    return dispatch => {
        ipcRenderer.send('deleteBlade', _id);
        ipcRenderer.on('blade:deleted', (event, blades) => {
            dispatch({
                type: FETCH_BLADES,
                payload: blades
            });
        });
    }
}