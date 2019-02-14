/**
 * create by sxf on 2019/2/14.
 * 功能:
 */

import {fork} from "redux-saga/effects";
import {watchWebsocket} from './sagas/WebsocketSaga'


export default function* rootSaga() {
    yield fork(watchWebsocket);
}