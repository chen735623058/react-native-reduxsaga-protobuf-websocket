import React, {Component} from 'react';
import { Provider } from 'react-redux'
import store from './app/store'
import Home from './app/pages/home'

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <Home/>
            </Provider>
        );
    }
}