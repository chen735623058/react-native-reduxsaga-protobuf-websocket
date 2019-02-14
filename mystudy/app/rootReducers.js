/**
 * create by sxf on 2019/2/14.
 * 功能:
 */

import {combineReducers} from  'redux'
import WebsocketReducer from './reducers/WebsocketReducer'

//这里面必须要有初始数据 - 否则报错
const rootReducer = combineReducers({
    WebsocketReducer
});

export default rootReducer;
