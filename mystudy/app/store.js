/**
 * create by sxf on 2019/2/14.
 * 功能:
 */

import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware , { END } from 'redux-saga'
import {createLogger}  from 'redux-logger'
import rootReducer from './rootReducers'
import sagas from './rootsagas'

const configureStore = preloadedState => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        preloadedState,
        compose (
            applyMiddleware(sagaMiddleware, createLogger())
        )
    )
    sagaMiddleware.run(sagas);
    store.close = () => store.dispatch(END)
    return store;
}

const store = configureStore();
export default store;