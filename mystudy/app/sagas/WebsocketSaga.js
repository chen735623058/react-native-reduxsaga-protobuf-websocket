/**
 * create by sxf on 2019/2/14.
 * 功能:
 */

import { END} from 'redux-saga'
import { put , take, fork ,cancel ,cancelled,delay,call} from 'redux-saga/effects'
import {CONNECT,CONNECTCLOSE,SENDMSG}  from './../actionsTypes'
import {connectsuccess,connectfall,wsmsgres} from './../actions/WebsocketAction'
var protobuf = require("protobufjs");

var ws = null; // 缓存 websocket连接
var _mydispatch = null; // 这个变量是因为saga无法支持callback 只能变通处理（这也是个坑点）
var protpfile = null; // 缓存proto文件
export function* watchWebsocket() {
    while (true){
        const action = yield take(CONNECT);
        if(_mydispatch == null){
            _mydispatch = action.connectobj.mydispatch;
        }
        yield fork(connectWebsocket,_mydispatch);
        var sendmsgTask = yield fork(sendmsg);
        yield take(CONNECTCLOSE);
        yield fork(connectcolseWebsocket);
        yield cancel(sendmsgTask);
    }
}

function* sendmsg(){
    try{
        while (true){
            const sendaction = yield take(SENDMSG);
            yield fork(decodeencodewithproto,sendaction.sendmsg.msgtext);

        }
    }finally {
        if(yield cancelled()){
            console.log("取消了监听发送任务");
        }
    }
}

function* decodeencodewithproto(sendstr) {
    let restroot ;
    if(protpfile == null){
        // 缓存proto 对象
        restroot = yield call(protobuffun);
        protpfile = restroot;
    }else{
        restroot = protpfile;
    }
    var AwesomeMessage = restroot.lookupType("awesomepackage.AwesomeMessage");
    var payload = { awesomeField: sendstr };
    var errMsg = AwesomeMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);
    var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
    var buffer = AwesomeMessage.encode(message).finish();
    ws.send(buffer);
}


function protobuffun() {
    return new Promise(resolve => {
        var jsonDescriptor = require("./awesome.json"); // exemplary for node
        var root = protobuf.Root.fromJSON(jsonDescriptor);
        resolve(root);
    })
}


function* connectcolseWebsocket() {
    ws.close();
}

function* connectWebsocket(mydispatch) {
    ws = new WebSocket("ws://echo.websocket.org");

    ws.onopen = () => {
        mydispatch(connectsuccess())
    };
    ws.onerror = e => {
        mydispatch(connectfall())
    };
    ws.onmessage = e => {
        console.log(e.data)
        var buf = new Uint8Array(e.data);
        var _AwesomeMessage = protpfile.lookupType("awesomepackage.AwesomeMessage");
        var message = _AwesomeMessage.decode(buf).awesomeField;
        console.log(message);
        mydispatch(wsmsgres(message))
    };
    ws.onclose = e => {
        // connection closed
        mydispatch(connectfall())
    };
}